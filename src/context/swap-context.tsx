import { ICommonStep } from "@astrolabs/swapper";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { getSwapRouteRequest } from "~/utils/api";
import { Token } from "~/utils/interfaces";
import { StrategyContext } from "./strategy-context";
import { TokensContext } from "./tokens-context";
import { estimationQuerySlug } from "~/utils/format";
import { generateAndSwap } from "~/utils/lifi";

let debounceTimer;

interface SwapContextType {
  switchSelectMode: () => void;
  selectFromToken: (token: Token) => void;
  selectToToken: (token: Token) => void;
  updateFromValue: (value: string) => void;
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

  const { data: estimation } = useQuery(
    estimationQuerySlug(fromToken, toToken, fromValue),
    () => {
      setEstimationOnProgress(true);
      const promise = getSwapRouteRequest({
        fromToken,
        toToken,
        strat: selectedStrategy,
        amount: Number(fromValue),
        address,
      })
        .then((res) => {
          setEstimationOnProgress(false);
          return res;
        })
        .catch((e) => {
          setEstimationOnProgress(false);
          throw new Error(e);
        });
      toast.promise(promise, {
        pending: "Calculating...",
        error: "route not found from Swapper 🤯",
      });
      return promise;
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
      enabled:
        fromToken &&
        Number(fromValue) > 0 &&
        !writeOnProgress &&
        !estimationOnProgress,
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
    const [tr, promise] = await generateAndSwap({
      address,
      fromToken,
      toToken,
      amount: Number(fromValue),
      strat: selectedStrategy,
    });
    setSteps(tr.steps);
  };

  const selectFromToken = (token: Token) => setFromToken(token);
  const selectToToken = (token: Token) => setToToken(token);

  useEffect(() => {
    if (!fromToken) {
      const token = tokenBySlug(sortedBalances?.[0]?.slug) ?? null;

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

  return (
    <SwapContext.Provider
      value={{
        switchSelectMode,
        selectFromToken,
        selectToToken,
        updateFromValue,
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
