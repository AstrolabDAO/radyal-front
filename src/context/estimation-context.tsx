import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useEstimateRoute, useExecuteSwap } from "~/hooks/swap";
import { cacheHash } from "~/utils/format";
import { SwapContext } from "./swap-context";
import { SwapStepsContext } from "./swap-steps-context";

const EstimationContext = createContext<EstimationContextType>({
  swap: async () => {},
  lockEstimate: () => {},
  unlockEstimate: () => {},
  toValue: null,
  estimation: null,
  estimationError: null,
  needApprove: false,
});

let debounceTimer;

const EstimationProvider = ({ children }) => {
  const {
    fromValue,
    fromToken,
    toToken,
    action,
    canSwap,
    setCanSwap,
    allowance,
  } = useContext(SwapContext);

  const [writeOnProgress, setWriteOnprogress] = useState<boolean>(true);
  const [estimationOnProgress, setEstimationOnProgress] =
    useState<boolean>(false);

  const [toValue, setToValue] = useState<number>(null);

  const [estimationError, setEstimationError] = useState<string>(null);

  const [updateEstimation, setUpdateEstimation] = useState(true);

  const estimateRoute = useEstimateRoute();

  const executeSwap = useExecuteSwap();

  const { setSteps } = useContext(SwapStepsContext);
  const { data: estimation } = useQuery(
    cacheHash("estimate", action, fromToken, toToken, fromValue),
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
        updateEstimation &&
        fromValue > 0
      ),
    }
  );

  const needApprove = useMemo(() => {
    if (!allowance || !fromToken) return false;
    return allowance <= BigInt(fromValue * fromToken.weiPerUnit);
  }, [allowance, fromToken, fromValue]);

  useEffect(() => {
    if (!estimation || estimation.error) {
      setToValue(estimationOnProgress ? null : 0);
      setSteps([]);
    }

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
  }, [estimation, estimationOnProgress, setCanSwap, setSteps]);

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
    <EstimationContext.Provider
      value={{
        toValue,
        estimation,
        estimationError,
        needApprove,
        swap,
        unlockEstimate: () => setUpdateEstimation(true),
        lockEstimate: () => setUpdateEstimation(false),
      }}
    >
      {children}
    </EstimationContext.Provider>
  );
};
interface EstimationContextType {
  swap: () => Promise<void>;
  lockEstimate: () => void;
  unlockEstimate: () => void;
  estimation: any; // todo: change it;
  estimationError: string;
  toValue: number;
  needApprove: boolean;
}

export { EstimationContext, EstimationProvider };
