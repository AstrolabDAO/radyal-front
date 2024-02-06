import { useCurrentSteps } from "~/hooks/store/operation";
import SwapRouteDetail from "../SwapRouteDetail";

const SwapStepsModal = () => {
  const currentSteps = useCurrentSteps();

  return (
    <div className="p-4">
      <div className="card">
        <div className="text-2xl text-white mb-3 uppercase">Tx tracking</div>
        <SwapRouteDetail steps={currentSteps} showStatus={true} />
      </div>
    </div>
  );
};
export default SwapStepsModal;
