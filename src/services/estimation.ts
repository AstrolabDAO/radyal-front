import { ICommonStep } from "@astrolabs/swapper";
import toast from "react-hot-toast";
import { tokensIsEqual } from "~/utils";
import { StrategyInteraction } from "~/utils/constants";
import { previewStrategyTokenMove } from "~/utils/flows/strategy";
import { Estimation } from "~/utils/interfaces";
import { weiToAmount } from "~/utils/maths";
import { getSelectedStrategy } from "./strategies";
import { getSwapRoute } from "./swap";
import {
  getEstimationOnProgress,
  getInteraction,
  getInteractionNeedApprove,
  getInteractionNeedToSwap,
  getSwapperStore,
  setEstimationOnprogress,
  setInteractionEstimation,
} from "./swapper";
import { OperationStep } from "~/model/operation";

export const estimate = async (): Promise<Estimation> => {
  const store = getSwapperStore();
  const interaction = getInteraction();
  const { from, to, value } = store[interaction];
  const strategy = getSelectedStrategy();
  const onProgress = getEstimationOnProgress();
  try {
    if (onProgress) return { error: "Estimation already in progress" };

    setEstimationOnprogress(true);

    if (tokensIsEqual(from, to)) {
      const result = await previewStrategyTokenMove({
        strategy,
        interaction,
        value,
      });
      setEstimationOnprogress(false);
      return result;
    }
    let result, interactionEstimation;
    if (
      from.network.id === to.network.id ||
      StrategyInteraction.WITHDRAW === interaction
    ) {
      if (interaction === StrategyInteraction.DEPOSIT) {
        result = await getSwapRoute();
        /*interactionEstimation = await previewStrategyTokenMove(
        result[0].estimatedOutput
      );*/
      } else {
        interactionEstimation = await previewStrategyTokenMove({
          strategy,
          interaction,
          value,
        });
        result = await getSwapRoute(interactionEstimation.estimation);
      }
    } else {
      result = await getSwapRoute();
    }

    if (!result) {
      const error: string = "No viable route found by Swapper 🤯";
      toast.error(error);
      setEstimationOnprogress(false);
      return { error };
    }

    const steps: OperationStep[] = result[0].steps.map((step: ICommonStep) => ({
      ...step,
      via: result[0].aggregatorId,
    }));
    const lastStep = steps[steps.length - 1];

    const estimationStep =
      lastStep.type === "custom" ? steps[steps.length - 2] : lastStep;

    const receiveEstimation =
      result[0].estimatedOutput ??
      weiToAmount(
        estimationStep?.estimate?.toAmount,
        estimationStep?.toToken?.decimals
      );

    const computedSteps = !interactionEstimation
      ? steps
      : interaction === StrategyInteraction.DEPOSIT
        ? [
            ...steps,
            ...(tokensIsEqual(from, to) ? interactionEstimation.steps : []),
          ]
        : [...interactionEstimation.steps, ...steps];
    setEstimationOnprogress(false);
    return {
      id: window.crypto.randomUUID(),
      estimation: receiveEstimation,
      steps: computedSteps,
      request: result[0],
    };
  } catch (error) {
    toast.error("An error has occured");
    return { error: "An error has occured" };
  }
};

export const updateEstimation = (estimationData: Estimation) => {
  if (!estimationData) {
    return;
  }
  const state = getSwapperStore();
  let steps = estimationData?.steps;
  const interaction = getInteraction();
  const needApprove = getInteractionNeedApprove();
  const needToSwap = getInteractionNeedToSwap();
  const { from: baseFrom, to: baseTo, value } = state[interaction];
  const from = "asset" in baseFrom ? baseFrom.asset : baseFrom;
  const to = "asset" in baseTo ? baseTo.asset : baseTo;

  const spender = !needToSwap
    ? baseTo?.address
    : estimationData?.request?.approvalAddress;

  if (
    steps &&
    !(steps?.length === 1 && interaction === StrategyInteraction.WITHDRAW)
  ) {
    const leftArray = [steps[0]];
    const rightArray = steps.slice(1);

    if (needApprove && steps[0].type !== "approve") {
      const isDeposit = interaction === StrategyInteraction.DEPOSIT;
      const { weiPerUnit } = from;
      const fromAmount = isDeposit
        ? value * weiPerUnit
        : Number(rightArray[0].fromAmount);

      const approveAmount = Math.round(fromAmount / weiPerUnit) * weiPerUnit;
      (isDeposit ? leftArray : rightArray).unshift({
        id: window.crypto.randomUUID(),
        type: "approve",
        tool: "radyal",
        fromChain: from?.network?.id,
        toChain: from?.network?.id,
        fromAddress: from?.address,
        toAddress: spender,
        fromAmount: approveAmount.toString(),
        fromToken: from,
        estimate: {
          tool: "custom",
          fromAmount: approveAmount.toString(),
        },
      } as OperationStep);
    }
    if (steps[steps.length - 1]?.type === "custom") {
      const lastStep = { ...steps[steps.length - 1] };
      const beforeLastStep = steps[steps.length - 2];
      lastStep.fromAmount = beforeLastStep.toAmount;
      lastStep.fromToken = beforeLastStep.toToken;
      lastStep.toAmount = (
        estimationData.estimation * to.weiPerUnit
      ).toString();
      lastStep.toToken = to;

      rightArray[rightArray.length - 1] = lastStep;
    }
    steps = [...leftArray, ...rightArray];
  }

  const estimation = {
    ...estimationData,
    steps,
  } as Estimation;

  setInteractionEstimation(estimation);
};
