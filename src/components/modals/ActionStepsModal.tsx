import { useMemo } from "react";

import {
  useCurrentStep,
  useCurrentSteps,
  useSelectedOperation,
} from "~/hooks/store/operation";

import ChevronLeft from "~/assets/icons/chevron-left.svg?react";
import Close from "~/assets/icons/close.svg?react";

import clsx from "clsx";
import ArrowRight from "~/assets/icons/left-to-right-thin.svg?react";
import ActionRouteDetail from "~/components/swap/helpers/ActionRouteDetail";
import ActionStepsAnimation from "~/components/swap/helpers/ActionStepsAnimation.tsx";
import TokenPresentation from "../TokenPresentation";
import { useCloseModal } from "~/hooks/store/modal";

const ActionStepsModal = () => {
  const currentSteps = useCurrentSteps();
  const currentStep = useCurrentStep();
  const operation = useSelectedOperation();

  const animationStep = useMemo(() => {
    if (!currentStep) return null;
    return currentStep.type as "bridge" | "deposit" | "swap" | "withdraw";
  }, [currentStep]);

  const closeModal = useCloseModal();
  return (
    <div className="modal-wrapper">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-0 items-center justify-between">
          <div className="flex my-auto h-5">
            <ChevronLeft
              onClick={closeModal}
              className="fill-[#616161] hover:fill-primary cursor-pointer"
            />
          </div>
          <div className="text-3xl text-white uppercase font-bold gilroy my-auto text-center">
            Tx tracking
          </div>
          <div className="flex my-auto h-5">
            <Close
              onClick={closeModal}
              className="fill-[#616161] hover:fill-primary cursor-pointer"
            />
          </div>
        </div>
        <ActionStepsAnimation
          mode={animationStep}
          className="mx-auto overflow-hidden invert w-52 -mt-6 mb-2"
        />
        <div
          key={`notification-${operation.id}`}
          className={clsx("flex flex-col")}
        >
          <div
            className={clsx(
              "relative flex flex-row justify-between border-solid border-2 rounded-2xl py-4 px-8",
              "border-dark-600"
            )}
          >
            <TokenPresentation
              token={operation.fromToken}
              isHoverable={false}
            />
            <div className="centerXY">
              <ArrowRight className="fill-dark-500 w-10" />
            </div>
            <TokenPresentation token={operation.toToken} isHoverable={false} />
          </div>
        </div>
        <ActionRouteDetail steps={currentSteps} showStatus={true} />
      </div>
    </div>
  );
};
export default ActionStepsModal;
