import { ICommonStep } from "@astrolabs/swapper";
import { useSelector } from "react-redux";
import { Operation, OperationStatus } from "~/model/operation";
import {
  createOperationSelector,
  createOperationsByStatusSelector,
  createStepsSelector,
  operationsSelector,
  selectedOperationSelector,
} from "~/store/selectors/operations";

export const useSelectedOperation = (): Operation => {
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

export const useOperations = (): Operation[] => {
  return useSelector(operationsSelector);
};

export const useOperationsByStatus = (status: OperationStatus) => {
  const selector = createOperationsByStatusSelector(status);
  return useSelector(selector);
};
