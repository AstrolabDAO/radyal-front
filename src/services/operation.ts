import { Operation, OperationStatus } from "~/model/operation";
import { getStore, getStoreState } from "~/store";
import {
  createOperationSelector,
  createOperationsByStatusSelector,
  createStepsSelector,
  operationsSelector,
  selectedOperationSelector,
} from "~/store/selectors/operations";
import axios from "axios";
import {
  EmmitStepAction,
  LiFITransactionStatusResponse,
  OperationStep,
  UpdateAction,
} from "~/store/interfaces/operations";
import {
  OperationsState,
  add,
  failCurrentStep,
  update,
} from "~/store/operations";

import { emmitStep as StoreEmmitStep } from "~/store/operations";
export const getOperationsStore = () => {
  return getStoreState().operations;
};
export const getOperations = () => {
  return operationsSelector(getStoreState());
};

export const getOperationsByStatus = (status: OperationStatus) => {
  const selector = createOperationsByStatusSelector(status);
  return selector(getStoreState());
};

export const getSelectedOperation = () => {
  return selectedOperationSelector(getStoreState());
};

export const getCurrentSteps = () => {
  return getSelectedOperation()?.steps ?? [];
};

export const getSteps = (operationId: string) => {
  const stepsSelector = createStepsSelector(operationId);
  return stepsSelector(getStoreState());
};

export const getOperation = (operationId: string) => {
  const operationSelector = createOperationSelector(operationId);
  return operationSelector(getStoreState());
};
export const updateOperation = (action: UpdateAction) => {
  getStore().dispatch(update(action));
};

export const addOperation = (operation: Operation) => {
  getStore().dispatch(add(operation));
};
export const getCurrentStep = () => {
  const currentSteps = getCurrentSteps();
  return (
    currentSteps.filter(
      ({ status }) =>
        status !== OperationStatus.DONE && status !== OperationStatus.FAILED
    )[0] ?? null
  );
};

export const emmitStep = (action: EmmitStepAction) => {
  getStore().dispatch(StoreEmmitStep(action));
};

export const checkInterval = () => {
  const intervalId = (getStoreState().operations as OperationsState).intervalId;

  if (intervalId) return intervalId;
  return setInterval(() => {
    const intervalId = (getStoreState().operations as OperationsState)
      .intervalId;

    const listByStatus = getOperationsByStatus(OperationStatus.PENDING);

    if (listByStatus.length === 0) {
      clearInterval(intervalId);
      getStore().dispatch({
        type: "operations/updateIntervalId",
        payload: {
          intervalId: null,
        },
      });
    }
    listByStatus
      .filter((operation) => !!operation.txHash)
      .forEach(async (operation: Operation) => {
        try {
          if (operation.estimation.request.aggregatorId === "LIFI") {
            const result: LiFITransactionStatusResponse = (
              await axios.get(
                `https://li.quest/v1/status?txHash=${operation.txHash}`
              )
            ).data;

            if (result?.status === OperationStatus.DONE) {
              getStore().dispatch(
                update({
                  id: operation.id,
                  payload: {
                    status: OperationStatus.DONE,
                    receivingTx: result?.receiving.txLink,
                    sendingTx: result?.sending.txLink,
                    substatus: result?.substatus,
                    substatusMessage: result?.substatusMessage,
                    steps: operation.steps.map((step: OperationStep) => {
                      const isFail =
                        result?.substatus === "PARTIAL" &&
                        step.type === "custom";

                      return {
                        ...step,
                        failMessage: isFail
                          ? result?.substatusMessage
                          : undefined,
                        status: isFail
                          ? OperationStatus.FAILED
                          : OperationStatus.DONE,
                      };
                    }),
                  },
                })
              );
            } else if (result.status === OperationStatus.FAILED) {
              getStore().dispatch(
                update({
                  id: operation.id,
                  payload: {
                    status: OperationStatus.FAILED,
                  },
                })
              );
              getStore().dispatch(failCurrentStep(operation.id));
            }
          }
        } catch (e) {
          if (e?.response?.data?.code === 1011) {
            getStore().dispatch(
              update({
                id: operation.id,
                payload: {
                  status: OperationStatus.FAILED,
                },
              })
            );
            getStore().dispatch(failCurrentStep(operation.id));
          }
        }
      });
  }, 1000 * 10);
};
