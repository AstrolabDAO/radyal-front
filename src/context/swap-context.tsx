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
import { Strategy, Token } from "~/utils/interfaces";
import { tokenBySlug, tokensBySlugForPriceAPI } from "~/utils/mappings";
import { StrategyContext } from "./strategy-context";
import { TokensContext } from "./tokens-context";

let debounceTimer;

const baseValues = {
  switchSelectMode: () => {},
  selectFromToken: () => {},
  selectToToken: () => {},
  setFromValue: () => {},
  setSwapMode: () => {},
  setCanSwap: () => {},

  fromToken: null,
  toToken: null,
  fromValue: null,
  canSwap: false,
  swapMode: SwapMode.DEPOSIT,
  selectTokenMode: false,
};
const MinimalSwapContext = createContext<MinimalSwapContextType>(baseValues);

const SwapContext = createContext<SwapContext>({
  ...baseValues,
  swap: async () => {},
  lockEstimate: () => {},
  unlockEstimate: () => {},
  toValue: null,
  steps: [],
  estimation: null,
  estimationError: null,
});

const CompleteProvider = ({ children }) => {
  const baseContext = useContext(MinimalSwapContext);
  const { fromToken, toToken, fromValue, swapMode, canSwap, setCanSwap } =
    baseContext;

  const [toValue, setToValue] = useState<number>(null);
  const [steps, setSteps] = useState<ICommonStep[]>([]);

  const [writeOnProgress, setWriteOnprogress] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [estimationOnProgress, setEstimationOnProgress] =
    useState<boolean>(false);

  const [estimationError, setEstimationError] = useState<string>(null);

  const [updateEstimation, setUpdateEstimation] = useState(true);

  const executeSwap = useExecuteSwap();

  const estimateRoute = useEstimateRoute();

  const { data: estimation } = useQuery(
    cacheHash("estimate", swapMode, fromToken, toToken, fromValue),
    async () => {
      if (estimationOnProgress) return;
      setEstimationOnProgress(true);
      setEstimationError(null);
      const estimate = await estimateRoute();

      setEstimationOnProgress(false);
      return estimate;
    },
    {
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
    if (!estimation || estimation?.error) {
      setToValue(estimationOnProgress ? null : 0);
      setSteps([]);
      setCanSwap(false);

      if (estimation?.error) setEstimationError(estimation.error);
      return;
    }

    setToValue(estimation.estimation);
    setSteps(estimation.steps);
    setCanSwap(true);
  }, [estimation, estimationOnProgress, setCanSwap]);

  useEffect(() => {
    if (!fromValue) return;
    setWriteOnprogress(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setWriteOnprogress(false);
    }, 1000);
  }, [fromValue]);

  const swap = async () => {
    if (!fromToken || !toToken || !canSwap) return;
    setUpdateEstimation(false);
    const tr = await executeSwap();

    setSteps(tr.steps);
  };

  return (
    <SwapContext.Provider
      value={{
        ...baseContext,
        swap,
        toValue,
        steps,
        estimation,
        estimationError,
        unlockEstimate: () => setUpdateEstimation(true),
        lockEstimate: () => setUpdateEstimation(false),
      }}
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

  const [fromToken, setFromToken] = useState<Token | Strategy>(null);
  const [toToken, setToToken] = useState<Token | Strategy>(null);

  const [canSwap, setCanSwap] = useState(false);

  const selectFromToken = (from: Token | Strategy) => setFromToken(from);
  const selectToToken = (to: Token | Strategy) => setToToken(to);

  useEffect(() => {
    if (fromToken) tokensBySlugForPriceAPI[fromToken?.slug] = fromToken;
    if (toToken) tokensBySlugForPriceAPI[toToken?.slug] = toToken;
  }, [fromToken, toToken]);

  useEffect(() => {
    switch (swapMode) {
      case SwapMode.DEPOSIT:
        setFromToken(null);
        setToToken(selectedStrategy);
        break;
      case SwapMode.WITHDRAW:
        setFromToken(selectedStrategy);
        setToToken(selectedStrategy?.asset);
        break;
      default:
        break;
    }
  }, [swapMode, selectedStrategy]);

  const switchSelectMode = useCallback(() => {
    setSelectTokenMode(!selectTokenMode);
  }, [selectTokenMode]);

  useEffect(() => {
    if (!fromToken) {
      const token = tokenBySlug[sortedBalances?.[0]?.slug] ?? null;
      selectFromToken(token);
    }
  }, [fromToken, selectedStrategy, sortedBalances, swapMode, toToken]);

  return (
    <MinimalSwapContext.Provider
      value={{
        switchSelectMode,
        selectFromToken,
        selectToToken,
        setFromValue: (value: number) => setFromValue(value ?? 0),
        setCanSwap: (value: boolean) => setCanSwap(value),
        setSwapMode: (mode: SwapMode) => {
          setSwapMode(mode);
        },
        fromToken,
        toToken,
        fromValue,
        swapMode,
        canSwap,
        selectTokenMode,
      }}
    >
      <CompleteProvider>{children}</CompleteProvider>
    </MinimalSwapContext.Provider>
  );
};

interface MinimalSwapContextType {
  switchSelectMode: () => void;
  selectFromToken: (token: Token | Strategy) => void;
  selectToToken: (token: Token | Strategy) => void;
  setFromValue: (value: number) => void;
  setSwapMode: (mode: SwapMode) => void;
  setCanSwap: (value: boolean) => void;
  fromToken: Token | Strategy;
  toToken: Token | Strategy;
  fromValue: number;
  swapMode: SwapMode;
  canSwap: boolean;
  selectTokenMode: boolean;
}

interface SwapContext extends MinimalSwapContextType {
  swap: () => Promise<void>;
  lockEstimate: () => void;
  unlockEstimate: () => void;
  steps: ICommonStep[];
  estimation: any; // todo: change it;
  estimationError: string;
  toValue: number;
}

export { SwapContext, MinimalSwapContext, SwapProvider };
