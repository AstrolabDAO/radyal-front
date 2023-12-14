import { ICommonStep } from "@astrolabs/swapper";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAccount, usePublicClient } from "wagmi";
import { getSwapRouteRequest } from "~/utils/api";
import { StrategyContext } from "./strategy-context";
import { TokensContext } from "./tokens-context";
import { cacheHash } from "~/utils/format";
import { useExecuteSwap } from "~/hooks/swap";
import { SwapMode } from "~/utils/constants";
import { Token } from "~/utils/interfaces";
import { tokensIsEqual } from "~/utils";
import { previewStrategyTokenMove } from "~/utils/web3";
import { Client } from "viem";

let debounceTimer;

interface SwapContextType {
  switchSelectMode: () => void;
  selectFromToken: (token: Token) => void;
  selectToToken: (token: Token) => void;
  updateFromValue: (value: string) => void;
  setSwapMode: (mode: SwapMode) => void;
  swap: () => void;
  fromToken: Token;
  toToken: Token;
  fromValue: string;
  sortedBalances: any;
  toValue: any;
  selectTokenMode: boolean;
  steps: any[];
}
export const SwapContext = createContext<SwapContextType>({
  switchSelectMode: () => {},
  selectFromToken: () => {},
  selectToToken: () => {},
  updateFromValue: () => {},
  setSwapMode: () => {},
  swap: () => {},
  fromToken: null,
  toToken: null,
  fromValue: null,
  sortedBalances: [],
  toValue: null,
  selectTokenMode: false,
  steps: [],
});

export const SwapProvider = ({ children }) => {
  const { address } = useAccount();

  const [mode, setMode] = useState<SwapMode>(SwapMode.DEPOSIT);
  const { selectedStrategy } = useContext(StrategyContext);
  const { sortedBalances } = useContext(TokensContext);
  const { tokenBySlug, tokensBySlug, tokens } = useContext(TokensContext);

  const [fromValue, setFromValue] = useState<string>(null);

  const [selectTokenMode, setSelectTokenMode] = useState(false);

  // TODO: Message if don't have balances
  const [fromToken, setFromToken] = useState<Token>(null);

  const [toToken, setToToken] = useState<Token>(null);

  const [writeOnProgress, setWriteOnprogress] = useState<boolean>(false);
  const [estimationOnProgress, setEstimationOnProgress] =
    useState<boolean>(false);

  const executeSwap = useExecuteSwap(fromToken);
  const publicClient = usePublicClient({
    chainId: selectedStrategy?.network?.id,
  }) as Client;
  const { data: estimation } = useQuery(
    cacheHash("estimate", mode, fromToken, toToken, fromValue),
    async () => {
      setEstimationOnProgress(true);
      try {
        if (tokensIsEqual(fromToken, toToken)) {
          const result = await previewStrategyTokenMove(
            {
              strategy: selectedStrategy,
              amount: fromValue,
              mode,
              address,
            },

            publicClient
          );
          console.log("🚀 ~ file: swap-context.tsx:98 ~ result:", result);
          setEstimationOnProgress(false);
          return result;
        } else {
          const result = await getSwapRouteRequest({
            address,
            fromToken,
            toToken,
            strat: selectedStrategy,
            amount: Number(fromValue),
            swapMode: mode,
          });
          console.log("🚀 ~ file: swap-context.tsx:109 ~ result:", result);
          setEstimationOnProgress(false);
          return result;
        }
      } catch (err) {
        setEstimationOnProgress(false);
      }
    },
    {
      onSuccess() {
        setEstimationOnProgress(false);
      },
      onError() {
        setEstimationOnProgress(false);
      },
      staleTime: 1000 * 15,
      cacheTime: 1000 * 15,
      retry: true,
      refetchInterval: 1000 * 15,
      enabled: !!(
        fromToken &&
        Number(fromValue) > 0 &&
        !writeOnProgress &&
        !estimationOnProgress
      ),
    }
  );

  const [toValue, setToValue] = useState<number>(null);
  const [steps, setSteps] = useState<ICommonStep[]>([]);

  useEffect(() => {
    if (!estimation) {
      setToValue(estimationOnProgress ? null : 0);
      setSteps([]);
      return;
    }

    setToValue(estimation.estimation);
    setSteps(estimation.steps);
  }, [estimation, estimationOnProgress]);

  useEffect(() => {
    setWriteOnprogress(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setWriteOnprogress(false);
    }, 1000);
  }, [fromValue]);

  const switchSelectMode = () => {
    setSelectTokenMode(!selectTokenMode);
  };

  const swap = async () => {
    if (!fromToken || !toToken) return;
    const [tr, promise] = await executeSwap({
      fromToken,
      toToken,
      amount: Number(fromValue),
      strat: selectedStrategy,
      swapMode: mode,
    });
    setSteps(tr.steps);
  };

  const selectFromToken = (token: Token) => setFromToken(token);
  const selectToToken = (token: Token) => setToToken(token);

  useEffect(() => {
    if (!fromToken) {
      const token = tokensBySlug[sortedBalances?.[0]?.slug] ?? null;

      selectFromToken(token);
    }
    if (!toToken) {
      const token = selectedStrategy ? selectedStrategy.token : tokens[0];
      selectToToken(token);
    }
  }, [
    sortedBalances,
    fromToken,
    tokensBySlug,
    tokenBySlug,
    selectedStrategy,
    tokens,
    toToken,
  ]);

  const updateFromValue = useCallback((value: string) => {
    setFromValue(value);
  }, []);

  const setSwapMode = useCallback((mode: SwapMode) => {
    setMode(mode);
  }, []);

  return (
    <SwapContext.Provider
      value={{
        switchSelectMode,
        selectFromToken,
        selectToToken,
        updateFromValue,
        setSwapMode,
        swap,
        fromToken,
        toToken,
        fromValue,
        sortedBalances,
        toValue,
        selectTokenMode,
        steps,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
