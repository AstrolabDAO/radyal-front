import { createSelector, current } from "@reduxjs/toolkit";
import { IRootState, dispatch, getStoreState } from "~/store";
import { SetOnWritePayload } from "~/store/interfaces/swapper";
import {
  canSwapSelector,
  estimatedRouteSelector,
  interactionNeedToSwapSelector,
  needApproveSelector,
} from "~/store/selectors/swapper";
import swapperActions, {
  SelectTokenAction,
  SwapperState,
} from "~/store/swapper";
import { StrategyInteraction } from "~/utils/constants";
import { Estimation } from "~/utils/interfaces";
import { closeModal, openModal } from "./modal";
import { Operation, OperationStatus, OperationStep } from "~/model/operation";
import { addOperation, emmitStep, updateOperation } from "./operation";
import { approve } from "./transaction";
import { getPublicClient } from "wagmi/actions";
import toast from "react-hot-toast";
import { executeSwap } from "./swap";

export const getSwapperStore = () => getStoreState().swapper;

export const getIsInit = () => getSwapperStore().is.init;
export const getIsSelection = () => getSwapperStore().is.selection;
export const getInteraction = () => getSwapperStore().interaction;

export const getFromToken = () => {
  const store = getSwapperStore();
  const interaction = store.interaction;
  return store[interaction].from;
};

export const getToToken = () => {
  const store = getSwapperStore();
  const interaction = store.interaction;
  return store[interaction].to;
};

export const getFromValue = () => {
  const store = getSwapperStore();
  const interaction = store.interaction;
  return store[interaction].value;
};

export const getCanSwap = () => {
  const state = getStoreState();
  return canSwapSelector(state);
};

export const initSwapper = (state: Partial<SwapperState>) => {
  return dispatch(swapperActions.init(state));
};

export const selectToken = (action: SelectTokenAction) => {
  return dispatch(swapperActions.select(action));
};

export const setHash = (hash: string) => {
  dispatch(swapperActions.setHash(hash));
};

export const switchSelection = () => {
  dispatch(swapperActions.switchSelection());
};

export const setInteraction = (interaction: StrategyInteraction) => {
  dispatch(swapperActions.setInteraction(interaction));
};

export const setEstimationIsLocked = (value: boolean) => {
  dispatch(swapperActions.setEstimationIsLocked(value));
};

export const lockEstimation = () => {
  dispatch(swapperActions.setLocked(true));
};
export const unlockEstimation = () => {
  dispatch(swapperActions.setLocked(false));
};
export const setFromValue = (value: number) => {
  dispatch(swapperActions.setFromValue(value));
};

export const getEstimationOnProgress = () => {
  const selector = createSelector(
    (state: IRootState) => state.swapper,
    (state) => state.is.estimationOnprogress
  );
  return selector(getStoreState());
};
export const setEstimationOnprogress = (value: boolean) => {
  dispatch(swapperActions.setEstimationOnprogress(value));
};

export const setInteractionEstimation = (estimation: Estimation) => {
  dispatch(swapperActions.setInteractionEstimation(estimation));
};

export const setOnWrite = (value: SetOnWritePayload) => {
  dispatch(swapperActions.setOnWrite(value));
};

export const getEstimatedRoute = () => {
  const state = getStoreState();
  return estimatedRouteSelector(state);
};

export const getInteractionNeedApprove = () => {
  const state = getStoreState();
  return needApproveSelector(state);
};

export const getInteractionNeedToSwap = () => {
  const state = getStoreState();
  return interactionNeedToSwapSelector(state);
};

export const executeSwapperRoute = async (
  estimation: Estimation = getEstimatedRoute(),
  interaction: StrategyInteraction = StrategyInteraction.DEPOSIT
) => {
  const store = getSwapperStore();
  const { from, to } = store[interaction];
  const canSwap = getCanSwap();

  const publicClient = getPublicClient({ chainId: from.network.id });

  if (!from || !to || !canSwap) return;

  setEstimationIsLocked(true);
  lockEstimation();

  openModal({ modal: "steps", title: "TX TRACKER" });

  const operation = new Operation({
    id: window.crypto.randomUUID(),
    fromToken: from,
    toToken: to,
    steps: estimation.steps.map((step) => {
      return {
        ...step,
        status: OperationStatus.WAITING,
      } as OperationStep;
    }),
    estimation,
  });

  try {
    if (estimation.steps[0].type == "approve") {
      const approveStep = estimation.steps[0];

      addOperation(operation);
      const { hash: approveHash } = await approve({
        spender: approveStep.toAddress as `0x${string}`,
        amount: BigInt(approveStep.fromAmount),
        address: approveStep.fromAddress as `0x${string}`,
        chainId: approveStep.fromChain,
      });
      const approvePending = publicClient.waitForTransactionReceipt({
        hash: approveHash,
      });
      toast.promise(approvePending, {
        loading: "Approve is pending...",
        success: "Approve transaction successful",
        error: "approve reverted rejected 🤯",
      });
      emmitStep({
        operationId: operation.id,
        promise: approvePending,
      });

      const hash = await executeSwap(operation, publicClient);
      updateOperation({
        id: operation.id,
        payload: {
          status: OperationStatus.PENDING,
          txHash: hash,
        },
      });
    } else {
      addOperation(operation);
      const hash = await executeSwap(operation, publicClient);
      updateOperation({
        id: operation.id,
        payload: {
          status: OperationStatus.PENDING,
          txHash: hash,
        },
      });
    }
  } catch (error) {
    closeModal();
    setEstimationIsLocked(false);
    unlockEstimation();
    toast.error(error.message);
    updateOperation({
      id: operation.id,
      payload: {
        status: OperationStatus.FAILED,
        steps: operation.steps
          .filter(({ status }) => status !== OperationStatus.DONE)
          .map((step) => {
            return {
              ...step,
              status: OperationStatus.FAILED,
            };
          }),
      },
    });
  }
};
