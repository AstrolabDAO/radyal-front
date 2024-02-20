import { createSelector } from "@reduxjs/toolkit";
import { IRootState, dispatch, getStoreState } from "~/store";
import { SetOnWritePayload } from "~/store/interfaces/swapper";
import {
  canSwapSelector,
  estimatedRouteSelector,
} from "~/store/selectors/swapper";
import swapperActions, {
  SelectTokenAction,
  SwapperState,
} from "~/store/swapper";
import { OperationType } from "~/constants";
import { Estimation } from "~/utils/interfaces";

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

export const setInteraction = (interaction: OperationType) => {
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
    (state: IRootState) => state.swapper.is.estimationOnprogress,
    (onProgress) => onProgress
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

/*
export const executeRoute = async () => {
  const fromToken = getFromToken();
  const toToken = getToToken();
  const canSwap = getCanSwap();
  const estimation = getEstimatedRoute();

  const publicClient = createPublicClient({
    chain: networkToWagmiChain(fromToken.network),
    transport: http(),
  });
  if (!fromToken || !toToken || !canSwap) throw new Error("Invalid route");
  lockEstimation();
  openModal({ modal: "steps" });

  const operation = new Operation({
    id: window.crypto.randomUUID(),
    fromToken,
    toToken,
    steps: estimation.steps.map((step) => {
      return {
        ...step,
        status: OperationStatus.WAITING,
      } as OperationStep;
    }),
    estimation,
  });
  try {
    if (estimation.steps[0].type === "approve") {
      const approveStep = estimation.steps[0];

      addOperation(operation);
      const hash = await approve({
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
      const hash = await executeSwap(operation);
      updateOperation({
        id: operation.id,
        payload: {
          status: OperationStatus.PENDING,
          txHash: hash,
        },
      });
    } else {
      addOperation(operation);
      const hash = await executeSwap(operation);
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
*/
