import TokenPresentation from "../TokenPresentation";

import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo } from "react";

import { Operation, OperationStatus } from "~/model/operation";

import ArrowRight from "~/assets/icons/left-to-right-thin.svg?react";
import { selectOperation } from "~/services/operation";
import { openModal } from "~/services/modal";

type NotificationTokenPresentationProps = {
  operation: Operation;
  disabled?: boolean;
};

const NotificationTokenPresentation = ({
  operation,
}: NotificationTokenPresentationProps) => {
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
          "relative flex flex-row justify-between border-solid border-2 rounded-2xl py-4 px-8",
          "border-dark-600",
          !["success", "pending", "failed"].includes(status) &&
            "border-dark-500",
          status === OperationStatus.DONE && "border-success/25",
          status === OperationStatus.WAITING && "border-warning/75",
          status === OperationStatus.FAILED && "border-error/25"
        )}
      >
        <TokenPresentation token={operation.fromToken} isHoverable={false}>
          <div className="text-xs text-nowrap text-dark-300">{fromValue}</div>
        </TokenPresentation>
        <div className="centerXY">
          <ArrowRight className="fill-dark-500 w-10" />
        </div>
        <TokenPresentation token={operation.toToken} isHoverable={false}>
          <div className="text-xs text-nowrap text-dark-300">{toValue}</div>
        </TokenPresentation>
      </div>
    </div>
  );
};

export default NotificationTokenPresentation;
