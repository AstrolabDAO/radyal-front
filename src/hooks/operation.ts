import { ICommonStep } from "@astrolabs/swapper";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OperationStatus } from "~/model/operation";
import {
  EmmitStepAction,
  OperationInterface,
} from "~/store/interfaces/operations";
import { emmitStep, selectOperation } from "~/store/operations";
import {
  createOperationSelector,
  createOperationsByStatusSelector,
  createStepsSelector,
  operationsSelector,
  selectedOperationSelector,
} from "~/store/selectors/operations";

export const useSelectedOperation = (): OperationInterface => {
  return useSelector(selectedOperationSelector);
};

export const useOperation = (operationId: string) => {
  const operationSelector = createOperationSelector(operationId);
  return useSelector(operationSelector);
};

export const useSteps = (operationId: string): ICommonStep[] => {
  const stepsSelector = createStepsSelector(operationId);
  return useSelector(stepsSelector);
};

export const useCurrentSteps = () => {
  const selectedOperation = useSelectedOperation();
  return selectedOperation?.steps ?? [];
};

export const useCurrentStep = () => {
  const currentSteps = useCurrentSteps();
  return (
    currentSteps.filter(
      ({ status }) =>
        status !== OperationStatus.DONE && status !== OperationStatus.FAILED
    )[0] ?? null
  );
};

export const useOperations = () => {
  return useSelector(operationsSelector);
};

export const useOperationsByStatus = (status: OperationStatus) => {
  const selector = createOperationsByStatusSelector(status);
  return useSelector(selector);
};
export const useEmmitStep = () => {
  const dispatch = useDispatch();
  return useCallback(
    (action: EmmitStepAction) => dispatch(emmitStep(action)),
    [dispatch]
  );
};

export const useSelectOperation = () => {
  const dispatch = useDispatch();
  return useCallback(
    (operationId: string) => dispatch(selectOperation({ operationId })),
    [dispatch]
  );
};
