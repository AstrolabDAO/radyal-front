import { createSelector } from "@reduxjs/toolkit";
import { IRootState, dispatch, getStoreState } from "~/store";
import { SetOnWritePayload } from "~/store/interfaces/swapper";
import {
  canSwapSelector,
  estimatedRouteSelector,
  interactionNeedToSwapSelector,
  needApproveSelector,
} from "~/store/selectors/swapper";
import swapperActions, {
  ActionInteraction,
  SelectTokenAction,
  SwapperState,
} from "~/store/swapper";

import toast from "react-hot-toast";
import { getPublicClient } from "wagmi/actions";
import { Operation, OperationStatus, OperationStep } from "~/model/operation";
import { Estimation } from "~/utils/interfaces";
import { closeModal, openModal } from "./modal";
import { addOperation, emmitStep, updateOperation } from "./operation";
import { executeSwap } from "./swap";
import { approve } from "./transaction";
import { getWagmiConfig } from "./web3";
import { CgYoutube } from "react-icons/cg";

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

export const setInteraction = (interaction: ActionInteraction) => {
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

export const executeSwapperRoute = async (_operation?: Operation) => {
  const store = getSwapperStore();
  const interaction = store.interaction;
  const { from, to } = store[interaction];
  const canSwap = getCanSwap();

  const publicClient = getPublicClient(getWagmiConfig(), {
    chainId: from.network.id,
  });

  if (!from || !to || !canSwap) return;

  lockEstimation();
  const estimation = getEstimatedRoute();

  const operation =
    _operation ??
    new Operation({
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
    const steps = operation.steps;
    const afterFirstStep = steps.slice(1);

    if (
      estimation.steps[0].type == "approve" ||
      (interaction === ActionInteraction.WITHDRAW &&
        afterFirstStep[0]?.type === "approve")
    ) {
      const approveStep = estimation.steps[0];

      addOperation(operation);
      openModal({ modal: "steps", title: "TX TRACKER" });

      const approveHash = await approve({
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
        txHash: approveHash,
      });

      const hash = await executeSwap(operation, publicClient);
      updateOperation({
        id: operation.id,
        payload: {
          status:
            from.network.id === to.network.id
              ? OperationStatus.DONE
              : OperationStatus.PENDING,
          txHash: hash,
          steps: operation.steps.map((step) => {
            if (!(from.network.id === to.network.id)) return step;
            return {
              ...step,
              status: OperationStatus.DONE,
            };
          }),
        },
      });
    } else {
      addOperation(operation);
      openModal({ modal: "steps", title: "TX TRACKER" });

      const hash = await executeSwap(operation, publicClient);
      updateOperation({
        id: operation.id,
        payload: {
          status:
            from.network.id === to.network.id
              ? OperationStatus.DONE
              : OperationStatus.PENDING,
          txHash: hash,
          steps: operation.steps.map((step) => {
            if (!(from.network.id === to.network.id)) return step;
            return {
              ...step,
              status: OperationStatus.DONE,
            };
          }),
        },
      });
    }
  } catch (error) {
    console.error(error);
    closeModal();
    setEstimationIsLocked(false);
    unlockEstimation();
    toast.error("An error has occured");
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
