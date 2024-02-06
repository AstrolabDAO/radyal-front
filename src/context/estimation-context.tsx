import { createContext, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { useSelectedStrategy } from "~/hooks/store/strategies";
import {
  useEstimationHash,
  useEstimationIsEnabled,
  useFromToken,
  useFromValue,
  useInteractionNeedToSwap,
  useSetInteractionEstimation,
} from "~/hooks/store/swapper";
import { useEstimateRoute } from "~/hooks/swap";
import { useAllowance } from "~/hooks/transaction";
import { Estimation } from "~/utils/interfaces";

const EstimationContext = createContext({});

const EstimationProvider = ({ children }) => {
  const hash = useEstimationHash();
  const estimate = useEstimateRoute();
  const isEnabled = useEstimationIsEnabled();
  const fromValue = useFromValue();
  const fromToken = useFromToken();
  const setInteractionEstimation = useSetInteractionEstimation();
  const selectedStrategy = useSelectedStrategy();
  const interactionNeedToSwap = useInteractionNeedToSwap();
  const { address } = useAccount();
  const { data: estimationData } = useQuery(hash, estimate, {
    staleTime: 1000 * 15,
    cacheTime: 1000 * 15,
    retry: true,
    refetchInterval: 1000 * 15,
    enabled: isEnabled,
  });

  const [allowanceToken, spender] = useMemo(() => {
    if (!fromToken) return [null, null];

    const allowanceToken = "asset" in fromToken ? fromToken?.asset : fromToken;

    const spender = !interactionNeedToSwap
      ? selectedStrategy?.address
      : estimationData?.request?.approvalAddress;

    if (!spender) return [null, null];
    return [allowanceToken, spender];
  }, [
    estimationData?.request?.approvalAddress,
    fromToken,
    interactionNeedToSwap,
    selectedStrategy?.address,
  ]);

  const allowance = useAllowance({
    address: allowanceToken?.address,
    chainId: allowanceToken?.network?.id,
    args: [address, spender],
    enabled:
      !!allowanceToken && !!spender && allowanceToken?.address !== zeroAddress,
  }) as any as bigint;

  const needApprove = useMemo(() => {
    if (!allowance || !fromToken) return true;
    return allowance < BigInt(fromValue * fromToken.weiPerUnit);
  }, [allowance, fromToken, fromValue]);

  const estimation = useMemo(() => {
    if (!estimationData) return null;
    const steps = estimationData?.steps;

    if (needApprove && steps && steps[0].type !== "Approve") {
      steps.unshift({
        id: window.crypto.randomUUID(),
        type: "Approve",
        tool: "radyal",
        fromChain: fromToken?.network?.id,
        toChain: fromToken?.network?.id,
        fromAddress: fromToken?.address,
        toAddress: spender,
        fromAmount: (fromValue * fromToken.weiPerUnit).toString(),
        fromToken,
        estimate: {
          tool: "custom",
          fromAmount: (fromValue * fromToken.weiPerUnit).toString(),
        },
      } as any);
    }

    const estimation = {
      ...estimationData,
      steps,
    } as Estimation;

    return estimation;
  }, [estimationData, fromToken, fromValue, needApprove, spender]);

  useEffect(() => {
    setInteractionEstimation(estimation);
  }, [estimation, setInteractionEstimation]);
  return (
    <EstimationContext.Provider value={{}}>
      {children}
    </EstimationContext.Provider>
  );
};

export { EstimationContext, EstimationProvider };
