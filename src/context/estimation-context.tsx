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
  useInteraction,
  useInteractionNeedToSwap,
  useSetInteractionEstimation,
  useToToken,
} from "~/hooks/store/swapper";
import { useEstimateRoute } from "~/hooks/swap";
import { useAllowance } from "~/hooks/transaction";
import { OperationStep } from "~/store/interfaces/operations";
import { StrategyInteraction } from "~/utils/constants";
import { Estimation } from "~/utils/interfaces";

const EstimationContext = createContext({});

const EstimationProvider = ({ children }) => {
  const hash = useEstimationHash();
  const estimate = useEstimateRoute();
  const isEnabled = useEstimationIsEnabled();
  const toToken = useToToken();
  const fromValue = useFromValue();
  const fromToken = useFromToken();
  const setInteractionEstimation = useSetInteractionEstimation();
  const selectedStrategy = useSelectedStrategy();
  const interaction = useInteraction();
  const interactionNeedToSwap = useInteractionNeedToSwap();
  const { address } = useAccount();
  const { data: estimationData } = useQuery(hash, estimate, {
    staleTime: 0,
    cacheTime: 0,
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
    let steps = estimationData?.steps;

    if (
      steps &&
      !(steps?.length === 1 && interaction === StrategyInteraction.WITHDRAW)
    ) {
      if (needApprove && steps[0].type !== "Approve") {
        const leftArray = [steps[0]];
        const rightArray = steps.slice(1);
        const isDeposit = interaction === StrategyInteraction.DEPOSIT;
        const { weiPerUnit } = fromToken;
        const fromAmount = isDeposit
          ? fromValue * weiPerUnit
          : rightArray[0].fromAmount;

        const approveAmount = Math.round(fromAmount / weiPerUnit) * weiPerUnit;
        (isDeposit ? leftArray : rightArray).unshift({
          id: window.crypto.randomUUID(),
          type: "Approve",
          tool: "radyal",
          fromChain: fromToken?.network?.id,
          toChain: fromToken?.network?.id,
          fromAddress: fromToken?.address,
          toAddress: spender,
          fromAmount: approveAmount.toString(),
          fromToken,
          estimate: {
            tool: "custom",
            fromAmount: approveAmount.toString(),
          },
        } as unknown as OperationStep);

        if (steps[steps.length - 1]?.type === "custom") {
          const lastStep = { ...steps[steps.length - 1] };
          const beforeLastStep = steps[steps.length - 2];
          lastStep.fromAmount = beforeLastStep.toAmount;
          lastStep.fromToken = beforeLastStep.toToken;
          lastStep.toAmount = estimationData.estimation * toToken.weiPerUnit;
          lastStep.toToken = toToken;

          rightArray[rightArray.length - 1] = lastStep;
        }
        steps = [...leftArray, ...rightArray];
      }
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
