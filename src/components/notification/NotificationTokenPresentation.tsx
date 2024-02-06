import { Token } from "~/utils/interfaces";
import TokenPresentation from "../TokenPresentation";
import { FaArrowRight } from "react-icons/fa";

import DangerIcon from "~/assets/icons/danger.svg?react";
import SuccessIcon from "~/assets/icons/checkmark.svg?react";

import clsx from "clsx";
import { OperationStatus } from "~/model/operation";

type NotificationTokenPresentationProps = {
  operation: {
    id: string,
    status: string,
    toToken: Token,
    fromToken: Token,
  };
  status?: OperationStatus;
};

const NotificationTokenPresentation = ({ operation, status = OperationStatus.DONE }: NotificationTokenPresentationProps) => {
  return (
    <div
      key={`notification-${operation.id}`}
      className="flex flex-col"
    >
      <div className="text-xs text-gray-400">
        DEC 20 11:55<span className="text-2xs">PM</span>
      </div>
      <div
        className={clsx('flex flex-row justify-between border-solid border-2 rounded-xl px-3 pb-2',
          !['success', 'pending', 'failed'].includes(status) && 'border-dark-500',
          status === OperationStatus.DONE && 'border-success/25',
          status === OperationStatus.WAITING && 'border-warning/75',
          status === OperationStatus.FAILED && 'border-error/25',
        )}
      >
        <TokenPresentation token={operation.fromToken} isHoverable={false}>
          <div className='text-xs text-nowrap text-dark-300'>
            Deposited 122,39m
          </div>
        </TokenPresentation>
        <div className='my-auto mx-4'>
          <FaArrowRight className="fill-white w-4 h-4" />
        </div>
        <TokenPresentation token={operation.fromToken} isHoverable={false}>
          <div className='text-xs text-nowrap text-dark-300'>
            For 122,39m
          </div>
        </TokenPresentation>
        <div className="h-8 w-8 my-auto ms-3">
          { status === OperationStatus.DONE && <SuccessIcon className="fill-success" /> }
          { status === OperationStatus.WAITING && <div className="astrolab-loading h-8 w-8" /> }
          { status === OperationStatus.FAILED && <DangerIcon className="fill-error" /> }
        </div>
      </div>
    </div>
  )
}

export default NotificationTokenPresentation;