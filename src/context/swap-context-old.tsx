import { ICommonStep } from "@astrolabs/swapper";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { Client } from "viem";
import { usePublicClient } from "wagmi";
import { useExecuteSwap } from "~/hooks/swap";
import { SwapMode } from "~/utils/constants";
import { cacheHash } from "~/utils/format";
import { Balance, SwapEstimation, Token } from "~/utils/interfaces";
import { StrategyContext } from "./strategy-context";
import { TokensContext } from "./tokens-context";

let debounceTimer;

interface SwapContextType {
  switchSelectMode: () => void;
  selectFromToken: (token: Token) => void;
  selectToToken: (token: Token) => void;
  updateFromValue: (value: number) => void;
  setSwapMode: (mode: SwapMode) => void;
  swap: () => void;
  fromToken: Token;
  toToken: Token;
  fromValue: number;
  toValue: number;
  sortedBalances: Balance[];
  selectTokenMode: boolean;
  steps: ICommonStep[];
  estimation?: SwapEstimation;
}
export const SwapContextOld = createContext<SwapContextType>({
  switchSelectMode: () => {},
  selectFromToken: () => {},
  selectToToken: () => {},
  updateFromValue: () => {},
  setSwapMode: () => {},
  swap: () => {},
  fromToken: null,
  toToken: null,
  fromValue: null,
  toValue: null,
  sortedBalances: [],
  selectTokenMode: false,
  steps: [],
  estimation: null,
});

export const SwapProviderOld = ({ children }) => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { sortedBalances } = useContext(TokensContext);

  const [mode, setMode] = useState<SwapMode>(SwapMode.DEPOSIT);

  const { tokenBySlug, tokensBySlug, tokens } = useContext(TokensContext);

  const [selectTokenMode, setSelectTokenMode] = useState(false);

  const [fromValue, setFromValue] = useState<number>(null);

  const [toValue, setToValue] = useState<number>(null);

  // TODO: Message if don't have balances
  const [fromToken, setFromToken] = useState<Token>(null);
  const [toToken, setToToken] = useState<Token>(null);

  const [steps, setSteps] = useState<ICommonStep[]>([]);

  const [writeOnProgress, setWriteOnprogress] = useState<boolean>(true);
  const [estimationOnProgress, setEstimationOnProgress] =
    useState<boolean>(false);

  const executeSwap = useExecuteSwap();
  const publicClient = usePublicClient({
    chainId: selectedStrategy?.network?.id,
  }) as Client;

  const { data: estimation } = useQuery(
    cacheHash("estimate", mode, fromToken, toToken, fromValue),
    async () => {
      setEstimationOnProgress(true);
      try {
        /*const interactionEstimation =
          tokensIsEqual(fromToken, toToken) || mode === SwapMode.WITHDRAW
            ? await previewStrategyTokenMove(
                {
                  strategy: selectedStrategy,
                  value: fromValue,
                  mode,
                },

                publicClient
              )
            : null;

        if (tokensIsEqual(fromToken, toToken)) {
          setEstimationOnProgress(false);
          return interactionEstimation;
        }
        const result = await getSwapRouteRequest({
          address,
          fromToken,
          toToken,
          strat: selectedStrategy,
          value: interactionEstimation
            ? interactionEstimation.estimation
            : fromValue,
          swapMode: mode,
        });
        if (interactionEstimation) {
          result.steps = [...interactionEstimation.steps, ...result.steps];
        }
        setEstimationOnProgress(false);
        return result;*/
      } catch (err) {
        console.error(err);
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
        fromValue > 0 &&
        !writeOnProgress &&
        !estimationOnProgress
      ),
    }
  );

  useEffect(() => {
    switch (mode) {
      case SwapMode.DEPOSIT:
        setFromToken(null);
        setToToken(selectedStrategy?.token);
        break;
      case SwapMode.WITHDRAW:
        setFromToken(selectedStrategy?.token);
        setToToken(null);
        break;
      default:
        break;
    }
  }, [mode, selectedStrategy?.token]);
  useEffect(() => {
    setWriteOnprogress(false);
    setWriteOnprogress(false);
  }, [fromToken, toToken]);
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
    const [tr] = await executeSwap({
      fromToken,
      toToken,
      value: fromValue,
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
    estimation,
  ]);

  const updateFromValue = useCallback((amount: number) => {
    setFromValue(amount);
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
        toValue,
        sortedBalances,
        selectTokenMode,
        steps,
        estimation: estimation as any, // TODO: change it
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
