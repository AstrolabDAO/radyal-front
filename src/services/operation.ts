import { Operation } from "~/model/operation";
import { getStore, getStoreState } from "~/store";
import {
  EmmitStepAction,
  OperationStep,
  UpdateAction,
} from "~/store/interfaces/operations";
import {
  OperationsState,
  add,
  failCurrentStep,
  update,
} from "~/store/operations";
import {
  createOperationSelector,
  createOperationsByStatusSelector,
  createStepsSelector,
  operationsSelector,
  selectedOperationSelector,
} from "~/store/selectors/operations";

import { OperationStatus, getStatus } from "@astrolabs/swapper";
import {
  emmitStep as storeEmmitStep,
  selectOperation as storeSelectOperation,
  deleteOperation as storeDeleteOperation,
} from "~/store/operations";
import { ONE_MINUTE } from "~/main";
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
export const deleteOperation = (id: string) => {
  getStore().dispatch(storeDeleteOperation(id));
};
export const selectOperation = (id: string) => {
  getStore().dispatch(storeSelectOperation(id));
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
  getStore().dispatch(storeEmmitStep(action));
};

export const checkInterval = () => {
  const intervalId = (getStoreState().operations as OperationsState).intervalId;

  if (intervalId) return intervalId;
  return setInterval(() => {
    const intervalId = (getStoreState().operations as OperationsState)
      .intervalId;

    const waitingOperatins = getOperationsByStatus(OperationStatus.WAITING);
    const listByStatus = getOperationsByStatus(OperationStatus.PENDING);

    waitingOperatins.forEach(({ id, date }) => {
      const now = new Date().getTime();

      if (now > date + ONE_MINUTE * 5)
        getStore().dispatch(
          update({
            id,
            payload: {
              status: OperationStatus.FAILED,
            },
          })
        );
    });
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
          const result = await getStatus({
            aggregatorIds: [operation.estimation.request.aggregatorId],
            transactionId: operation.txHash,
          });

          if (
            [OperationStatus.DONE, OperationStatus.SUCCESS].includes(
              result?.status.toUpperCase() as OperationStatus
            )
          ) {
            getStore().dispatch(
              update({
                id: operation.id,
                payload: {
                  status: OperationStatus.DONE,
                  receivingTx: result?.receivingTx,
                  sendingTx: result?.sendingTx,
                  substatus: result?.substatus,
                  substatusMessage: result?.substatusMessage,
                  steps: operation.steps.map((step: OperationStep) => {
                    const isFail =
                      result?.substatus === "PARTIAL" && step.type === "custom";

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
                  steps: operation.steps
                    .filter(({ status }) => status !== OperationStatus.DONE)
                    .map((step: OperationStep) => ({
                      ...step,
                      status: OperationStatus.FAILED,
                    })),
                },
              })
            );
            getStore().dispatch(failCurrentStep(operation.id));
          }
        } catch (e) {
          console.error("ERROR", e);
          if (e?.response?.data?.code === 1011) {
            getStore().dispatch(
              update({
                id: operation.id,
                payload: {
                  status: OperationStatus.FAILED,
                  steps: operation.steps
                    .filter(({ status }) => status !== OperationStatus.DONE)
                    .map((step: OperationStep) => ({
                      ...step,
                      status: OperationStatus.FAILED,
                    })),
                },
              })
            );
            getStore().dispatch(failCurrentStep(operation.id));
          }
        }
      });
  }, 1000 * 10);
};
