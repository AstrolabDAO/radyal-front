import { useContext, useEffect } from "react";
import SwapRouteDetail from "../SwapRouteDetail";
import { EstimationContext } from "~/context/estimation-context";
import { useCurrentSteps } from "~/hooks/store/operation";

const SwapStepsModal = () => {
  const { lockEstimate } = useContext(EstimationContext);
  useEffect(() => lockEstimate(), [lockEstimate]);

  const currentSteps = useCurrentSteps();

  return (
    <div className="p-4">
      <div className="card">
        <div className="text-2xl text-white mb-3 uppercase">
          Tx tracking
        </div>
        <SwapRouteDetail
          steps={ currentSteps }
          showStatus={ true }
        />
      </div>
    </div>
  );
};
export default SwapStepsModal;
