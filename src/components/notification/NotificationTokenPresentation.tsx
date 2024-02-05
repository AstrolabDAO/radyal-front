import { Token } from "~/utils/interfaces";
import TokenPresentation from "../TokenPresentation";
import { FaArrowRight } from "react-icons/fa";

import DangerIcon from "~/assets/icons/danger.svg?react";
import SuccessIcon from "~/assets/icons/checkmark.svg?react";

import clsx from "clsx";

type NotificationTokenPresentationProps = {
  operation: {
    id: string,
    status: string,
    toToken: Token,
    fromToken: Token,
  };
  status?: "success" | "pending" | "failed";
};

const NotificationTokenPresentation = ({ operation, status = "pending" }: NotificationTokenPresentationProps) => {
  return (
    <div
      key={`notification-${operation.id}`}
      className="flex flex-col"
    >
      <div className="text-xs text-dark-400">
        DEC 20 11:55PM
      </div>
      <div
        className={clsx('flex flex-row justify-between border-solid border-2 rounded-xl px-3 pb-2',
          !['success', 'pending', 'failed'].includes(status) && 'border-dark-500',
          status === 'success' && 'border-success/25',
          status === 'pending' && 'border-warning/75',
          status === 'failed' && 'border-error/25',
        )}
      >
        <TokenPresentation token={operation.fromToken} isHoverable={false}>
          <div className='text-xs text-nowrap'>
            Deposited 122,39m
          </div>
        </TokenPresentation>
        <div className='my-auto mx-4'>
          <FaArrowRight className="fill-white w-4 h-4" />
        </div>
        <TokenPresentation token={operation.fromToken} isHoverable={false}>
          <div className='text-xs text-nowrap'>
            For 122,39m
          </div>
        </TokenPresentation>
        <div className="h-8 w-8 my-auto ms-3">
          { status === 'success' && <SuccessIcon className="fill-success" /> }
          { status === 'pending' && <div className="astrolab-loading h-8 w-8" /> }
          { status === 'failed' && <DangerIcon className="fill-error" /> }
        </div>
      </div>
    </div>
  )
}

export default NotificationTokenPresentation;