import { useContext, useEffect } from "react";
import SwapRouteDetail from "../SwapRouteDetail";
import { EstimationContext } from "~/context/estimation-context";

const SwapStepsModal = () => {
  const { lockEstimate } = useContext(EstimationContext);
  useEffect(() => lockEstimate(), [lockEstimate]);
  return (
    <div className="p-4">
      <div className="card bg-base-100">
        <SwapRouteDetail />
      </div>
    </div>
  );
};
export default SwapStepsModal;
