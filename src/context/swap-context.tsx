import { ICommonStep } from "@astrolabs/swapper";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useEstimateRoute, useExecuteSwap } from "~/hooks/swap";
import { SwapMode } from "~/utils/constants";
import { cacheHash } from "~/utils/format";
import { Token } from "~/utils/interfaces";
import { tokenBySlug } from "~/utils/mappings";
import { StrategyContext } from "./strategy-context";
import { TokensContext } from "./tokens-context";

let debounceTimer;

const baseValues = {
  switchSelectMode: () => {},
  selectFromToken: () => {},
  selectToToken: () => {},
  setFromValue: () => {},
  setSwapMode: () => {},
  fromToken: null,
  toToken: null,
  fromValue: null,
  swapMode: SwapMode.DEPOSIT,
  selectTokenMode: false,
};
const MinimalSwapContext = createContext<MinimalSwapContextType>(baseValues);

const SwapContext = createContext<SwapContext>({
  ...baseValues,
  swap: () => {},
  toValue: null,
  steps: [],
  estimation: null,
});

const CompleteProvider = ({ children }) => {
  const baseContext = useContext(MinimalSwapContext);
  const { fromToken, toToken, fromValue, swapMode } = baseContext;

  const [toValue, setToValue] = useState<number>(null);
  const [steps, setSteps] = useState<ICommonStep[]>([]);

  const [writeOnProgress, setWriteOnprogress] = useState<boolean>(true);
  const [estimationOnProgress, setEstimationOnProgress] =
    useState<boolean>(false);

  const [updateEstimation, setUpdateEstimation] = useState(true);
  const executeSwap = useExecuteSwap();

  const estimateRoute = useEstimateRoute();

  const { data: estimation } = useQuery(
    cacheHash("estimate", swapMode, fromToken, toToken, fromValue),
    estimateRoute,
    {
      onSuccess() {
        setEstimationOnProgress(false);
      },
      onError(e) {
        console.error(e);
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
        !estimationOnProgress &&
        updateEstimation
      ),
    }
  );

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
    if (!fromValue) return;
    setWriteOnprogress(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setWriteOnprogress(false);
    }, 1000);
  }, [fromValue]);

  const swap = async () => {
    if (!fromToken || !toToken) return;
    setUpdateEstimation(false);
    const tr = await executeSwap();

    setSteps(tr.steps);
  };

  return (
    <SwapContext.Provider
      value={{ ...baseContext, swap, toValue, steps, estimation }}
    >
      {children}
    </SwapContext.Provider>
  );
};
const SwapProvider = ({ children }) => {
  const { sortedBalances } = useContext(TokensContext);
  const { selectedStrategy } = useContext(StrategyContext);
  const [swapMode, setSwapMode] = useState<SwapMode>(SwapMode.DEPOSIT);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  const [fromValue, setFromValue] = useState<number>(null);

  const [fromToken, setFromToken] = useState<Token>(null);
  const [toToken, setToToken] = useState<Token>(null);

  const selectFromToken = (token: Token) => setFromToken(token);
  const selectToToken = (token: Token) => setToToken(token);

  useEffect(() => {
    switch (swapMode) {
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
  }, [swapMode, selectedStrategy?.token]);

  const switchSelectMode = useCallback(() => {
    setSelectTokenMode(!selectTokenMode);
  }, [selectTokenMode]);

  useEffect(() => {
    if (!fromToken) {
      const token = tokenBySlug[sortedBalances?.[0]?.slug] ?? null;

      selectFromToken(token);
    }
    if (!toToken) {
      const token = selectedStrategy ? selectedStrategy.token : null;
      selectToToken(token);
    }
  }, [fromToken, selectedStrategy, sortedBalances, toToken]);

  return (
    <MinimalSwapContext.Provider
      value={{
        switchSelectMode,
        selectFromToken,
        selectToToken,
        setFromValue: (value: number) => setFromValue(value ?? 0),
        setSwapMode: (mode: SwapMode) => setSwapMode(mode),
        fromToken,
        toToken,
        fromValue,
        swapMode,
        selectTokenMode,
      }}
    >
      <CompleteProvider>{children}</CompleteProvider>
    </MinimalSwapContext.Provider>
  );
};

interface MinimalSwapContextType {
  switchSelectMode: () => void;
  selectFromToken: (token: Token) => void;
  selectToToken: (token: Token) => void;
  setFromValue: (value: number) => void;
  setSwapMode: (mode: SwapMode) => void;
  fromToken: Token;
  toToken: Token;
  fromValue: number;
  swapMode: SwapMode;
  selectTokenMode: boolean;
}

interface SwapContext extends MinimalSwapContextType {
  swap: () => void;
  steps: ICommonStep[];
  estimation: any; // todo: change it;
  toValue: number;
}

export { SwapContext, MinimalSwapContext, SwapProvider };
