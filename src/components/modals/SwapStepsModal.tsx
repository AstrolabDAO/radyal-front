import { useMemo } from "react";

import { useCurrentSteps } from "~/hooks/store/operation";
import { useSelectedOperation } from "~/hooks/store/operation";

import Close from "~/assets/icons/close.svg?react";
import ChevronLeft from "~/assets/icons/chevron-left.svg?react";

import SwapRouteDetail from "~/components/swap/helpers/SwapRouteDetail";
import SwapStepsAnimation from "~/components/swap/helpers/SwapStepsAnimation.tsx";

const SwapStepsModal = () => {

  const currentOperation = useSelectedOperation();
  const currentSteps = useCurrentSteps();
  const currentStatus = useMemo(() => {
    const currentStep = currentOperation?.steps.find((step) => step.status === 'WAITING');
    if (currentStep) {
      if (currentStep.type === "Approve") return "swap";
      return currentStep.type as "swap" | "deposit" | "withdraw" | "bridge";
    }
    return "deposit";
  }, [currentOperation]);
  return (
    <div className="modal-wrapper">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-0 items-center justify-between">
          <div className="flex my-auto h-5">
            <ChevronLeft className="fill-[#616161] hover:fill-primary cursor-pointer" />
          </div>
          <div className="text-3xl text-white uppercase font-bold gilroy my-auto text-center">
            Tx tracking
          </div>
          <div className="flex my-auto h-5">
            <Close className="fill-[#616161] hover:fill-primary cursor-pointer" />
          </div>
        </div>
        <SwapStepsAnimation
          mode={currentStatus}
          className="mx-auto overflow-hidden invert h-28 w-52"
        />
        <SwapRouteDetail
          steps={ currentSteps }
          showStatus={ true }
        />
      </div>
    </div>
  );
};
export default SwapStepsModal;
