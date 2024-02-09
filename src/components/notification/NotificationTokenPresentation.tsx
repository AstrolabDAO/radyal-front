import { FaArrowRight } from "react-icons/fa";
import TokenPresentation from "../TokenPresentation";

import SuccessIcon from "~/assets/icons/checkmark.svg?react";
import DangerIcon from "~/assets/icons/danger.svg?react";

import clsx from "clsx";
import { useMemo } from "react";
import { useOpenModal } from "~/hooks/store/modal";
import { useSelectOperation } from "~/hooks/store/operation";
import { Operation, OperationStatus } from "~/model/operation";
import ActionStepsModal from "../modals/ActionStepsModal";
import dayjs from "dayjs";
type NotificationTokenPresentationProps = {
  operation: Operation;
  disabled?: boolean;
};

const NotificationTokenPresentation = ({
  operation,
}: NotificationTokenPresentationProps) => {
  const selectOperation = useSelectOperation();
  const openModal = useOpenModal();

  const fromValue = useMemo(() => {
    const fromToken = operation.fromToken;
    const step1 = operation.steps[0];
    const fromAmount = Number(step1.fromAmount);
    return `${fromAmount / fromToken.weiPerUnit} ${fromToken.symbol}`;
  }, [operation]);

  const status = useMemo(() => operation.status, [operation]);

  const toValue = useMemo(() => {
    const toToken = operation.toToken;

    return `${operation.estimation.estimation} ${toToken.symbol}`;
  }, [operation]);
  return (
    <div
      key={`notification-${operation.id}`}
      className={clsx("flex flex-col my-4 cursor-pointer  ")}
      onClick={() => {
        selectOperation(operation.id);
        openModal({ modal: "steps" });
      }}
    >
      <div className="text-xs text-gray-400">
        <span className="text-2xs">
          {dayjs(operation.date).format("YYYY-MM-DD H:mm:ss")}
        </span>
      </div>
      <div
        className={clsx(
          "flex flex-row justify-between border-solid border-2 rounded-xl px-3 pb-2",
          !["success", "pending", "failed"].includes(status) &&
            "border-dark-500",
          status === OperationStatus.DONE && "border-success/25",
          status === OperationStatus.WAITING && "border-warning/75",
          status === OperationStatus.FAILED && "border-error/25"
        )}
      >
        <TokenPresentation token={operation.fromToken} isHoverable={false}>
          <div className="text-xs text-nowrap text-dark-300">
            Deposited {fromValue}
          </div>
        </TokenPresentation>
        <div className="my-auto mx-4">
          <FaArrowRight className="fill-white w-4 h-4" />
        </div>
        <TokenPresentation token={operation.fromToken} isHoverable={false}>
          <div className="text-xs text-nowrap text-dark-300">For {toValue}</div>
        </TokenPresentation>
        <div className="h-8 w-8 my-auto ms-3">
          {status === OperationStatus.DONE && (
            <SuccessIcon className="fill-success" />
          )}
          {status === OperationStatus.WAITING && (
            <div className="astrolab-loading h-8 w-8" />
          )}
          {status === OperationStatus.FAILED && (
            <DangerIcon className="fill-error" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationTokenPresentation;
