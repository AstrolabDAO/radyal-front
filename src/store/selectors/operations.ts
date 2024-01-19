import { createSelector } from "@reduxjs/toolkit";
import { Operation, OperationStatus } from "~/model/operation";

export const createStepsSelector = (operationId: string) => {
  return createSelector(
    [(state) => state.operations.byId, () => operationId],
    (byId, operationId) => byId[operationId]?.steps ?? []
  );
};
export const createOperationSelector = (operationId: string) => {
  return createSelector(
    [(state) => state.operations.byId, () => operationId],
    (byId, operationId) => {
      const operation = byId[operationId];
      return operation ? new Operation(operation) : null;
    }
  );
};

export const createOperationsByStatusSelector = (status: OperationStatus) => {
  return createSelector(
    (state) => state.operations.byStatus,
    (byStatus) => {
      const operations = byStatus[status] ?? [];
      return operations.map((operation) => new Operation(operation));
    }
  );
};
export const currentStepsSelector = createSelector(
  [
    (state) => state.operations.selectedOperationIndex,
    (state) => state.operations.list,
  ],
  (selectedOperationIndex, operations) => {
    const selectedTransaction = operations[selectedOperationIndex];

    return selectedTransaction?.steps ?? [];
  }
);

export const selectedOperationSelector = createSelector(
  [
    (state) => state.operations.list,
    (state) => state.operations.selectedOperationIndex,
  ],
  (operations, selectedOperationIndex) => {
    const operation = operations[selectedOperationIndex];
    return operation ? new Operation(operation) : null;
  }
);

export const operationsSelector = createSelector(
  [(state) => state.operations.list],
  (operations) => operations.map((operation) => new Operation(operation))
);
