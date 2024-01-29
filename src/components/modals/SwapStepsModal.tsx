import { useContext, useEffect } from "react";
import SwapRouteDetail from "../SwapRouteDetail";
import { EstimationContext } from "~/context/estimation-context";
import { useCurrentSteps, useOperations } from "~/hooks/store/operation";

const SwapStepsModal = () => {
  const { lockEstimate } = useContext(EstimationContext);
  useEffect(() => lockEstimate(), [lockEstimate]);

  const operations = useOperations();

  const currentSteps = useCurrentSteps();

  return (
    <div className="p-4">
      <div className="card bg-base-100">
        <SwapRouteDetail steps={currentSteps} />
      </div>
    </div>
  );
};
export default SwapStepsModal;
