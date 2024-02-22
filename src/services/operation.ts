import { EmmitStepAction, Operation, UpdateAction } from "~/model/operation";
import { getStoreState, store } from "~/store";
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

import {
  AggregatorId,
  OperationStatus,
  OperationStep,
  aggregatorById,
  getStatus,
} from "@astrolabs/swapper";
import {
  emmitStep as storeEmmitStep,
  selectOperation as storeSelectOperation,
  deleteOperation as storeDeleteOperation,
} from "~/store/operations";
import { ONE_MINUTE } from "~/App";

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
  store.dispatch(update(action));
};

export const addOperation = (operation: Operation) => {
  store.dispatch(add(operation));
};
export const deleteOperation = (id: string) => {
  store.dispatch(storeDeleteOperation(id));
};
export const selectOperation = (id: string) => {
  store.dispatch(storeSelectOperation(id));
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
  store.dispatch(storeEmmitStep(action));
};

export const startTimeById: { [key: string]: number } = {};

export const checkInterval = () => {
  const intervalId = (getStoreState().operations as OperationsState).intervalId;

  if (intervalId) return intervalId;
  return setInterval(() => {
    const intervalId = (getStoreState().operations as OperationsState)
      .intervalId;

    const waitingOperatins = getOperationsByStatus(OperationStatus.WAITING);
    const listByStatus = getOperationsByStatus(OperationStatus.PENDING);

    const now = new Date().getTime();
    waitingOperatins.forEach(({ id, date }) => {
      if (now > date + ONE_MINUTE * 5)
        store.dispatch(
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
      store.dispatch({
        type: "operations/updateIntervalId",
        payload: {
          intervalId: null,
        },
      });
    }
    listByStatus
      .filter((op) => !!op.txHash)
      .forEach(async (op: Operation) => {
        try {
          if (!startTimeById[op.id]) {
            startTimeById[op.id] = now;
          }
          const result = await getStatus({
            aggregatorIds: [op.estimation.request.aggregatorId],
            transactionId: op.txHash,
          });

          if (
            [OperationStatus.DONE, OperationStatus.SUCCESS].includes(
              result?.status.toUpperCase() as OperationStatus
            )
          ) {
            store.dispatch(
              update({
                id: op.id,
                payload: {
                  status: OperationStatus.DONE,
                  receivingTx: result?.receivingTx,
                  sendingTx: result?.sendingTx,
                  substatus: result?.substatus,
                  substatusMessage: result?.substatusMessage,
                  steps: op.steps.map((step: any) => {
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
            store.dispatch(
              update({
                id: op.id,
                payload: {
                  status: OperationStatus.FAILED,
                  steps: op.steps
                    .filter(({ status }) => status !== OperationStatus.DONE)
                    .map((step: any) => ({
                      ...step,
                      status: OperationStatus.FAILED,
                    })),
                },
              })
            );
            store.dispatch(failCurrentStep(op.id));
          }
        } catch (e) {
          console.error("ERROR", e);
          if (e?.response?.data?.code === 1011) {
            store.dispatch(
              update({
                id: op.id,
                payload: {
                  status: OperationStatus.FAILED,
                  steps: op.steps
                    .filter(({ status }) => status !== OperationStatus.DONE)
                    .map((step: any) => ({
                      ...step,
                      status: OperationStatus.FAILED,
                    })),
                },
              })
            );
            store.dispatch(failCurrentStep(op.id));
          }
        }
      });
  }, 1000 * 10);
};
