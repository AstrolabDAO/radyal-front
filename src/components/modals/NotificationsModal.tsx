import dayjs from "dayjs";
import { useMemo } from "react";

import { useOperations } from "~/hooks/operation";

import { OperationStatus } from "@astrolabs/swapper";
import SuccessIcon from "~/assets/icons/success.svg?react";
import DangerIcon from "~/assets/icons/warning.svg?react";

import { CgTrash } from "react-icons/cg";
import { openModal } from "~/services/modal";
import { deleteOperation, selectOperation } from "~/services/operation";
import TokenPresentation from "../TokenPresentation";
import { useIsMobile } from "~/hooks/utils";
import ToRight from "~/assets/icons/to-right.svg?react";
import clsx from "clsx";
export const NotificationsModal = () => {
  const operations = useOperations();

  const populatedOperations = useMemo(
    () =>
      operations.map((operation) => {
        const { fromToken, toToken } = operation;
        const iconBase = { size: { width: 20, height: 20 } };

        const step1 = operation.steps[0];
        const fromAmount = Number(step1.fromAmount);
        const fromValue = `${fromAmount / fromToken.weiPerUnit} ${fromToken.symbol}`;
        const toValue = `${operation.estimation.estimation} ${toToken.symbol}`;
        const status = operation.status;

        return {
          ...operation,
          fromToken,
          toToken,
          fromValue,
          toValue,
          status,
          iconBase,
        };
      }),
    [operations]
  );

  const isMobile = useIsMobile();
  return (
    <div>
      <div>
        {operations.length === 0 && (
          <div className="uppercase text-center text-md mt-12">
            Nothing to report yet
          </div>
        )}
        {operations.length > 0 && (
          <>
            {isMobile && (
              <div className="block">
                {populatedOperations.map((operation, index) => {
                  const { fromToken, toToken, fromValue, toValue, status } =
                    operation;

                  return (
                    <div>
                      <div
                        className={clsx(
                          "relative border-darkGrey border-solid border-1 bordered-hover rounded-xl pt-2",
                          {
                            "border-success": status === OperationStatus.DONE,
                            "border-danger": status === OperationStatus.FAILED,
                          }
                        )}
                        key={`operation-${operation.id}-${index}`}
                        onClick={() => {
                          selectOperation(operation.id);
                          openModal({ modal: "steps", title: "TX TRACKER" });
                        }}
                      >
                        <div className="flex w-full justify-center relative">
                          <TokenPresentation token={fromToken}>
                            {fromValue}
                          </TokenPresentation>
                          <div className="mx-4">
                            <ToRight className="fill-white w-12" />
                          </div>
                          <TokenPresentation token={toToken}>
                            {toValue}
                          </TokenPresentation>
                          <div
                            className="text-white hover:text-primary flex absolute top-0 right_0 mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOperation(operation.id);
                            }}
                          >
                            <CgTrash />
                          </div>
                        </div>
                        <div className="text-xs mb-2 text-center uppercase mt-2">
                          {dayjs(operation.date).format("YYYY-MM-DD H:mm:ss")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!isMobile && (
              <table className="table rounded-xl">
                <thead className="text-secondary">
                  <tr>
                    {["date", "from", "to", "status", ""].map(
                      (header, index) => {
                        return (
                          <th key={`strategy-table-header-${index}`}>
                            {header}
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>
                <tbody>
                  {populatedOperations.map((operation, index) => {
                    const { fromToken, toToken, fromValue, toValue, status } =
                      operation;
                    return (
                      <tr
                        key={`operation-${operation.id}-${index}`}
                        className="cursor-pointer bordered-hover"
                        onClick={() => {
                          selectOperation(operation.id);
                          openModal({ modal: "steps", title: "TX TRACKER" });
                        }}
                      >
                        <td>
                          {dayjs(operation.date).format("YYYY-MM-DD H:mm:ss")}
                        </td>
                        <td>
                          <TokenPresentation token={fromToken}>
                            {fromValue}
                          </TokenPresentation>
                        </td>
                        <td>
                          <TokenPresentation token={toToken}>
                            {toValue}
                          </TokenPresentation>
                        </td>
                        <td>
                          {status === OperationStatus.DONE && (
                            <SuccessIcon className="fill-success w-5" />
                          )}
                          {[
                            OperationStatus.PENDING,
                            OperationStatus.WAITING,
                          ].includes(status) && (
                            <div className="astrolab-loading after:h-5 after:w-5" />
                          )}
                          {status === OperationStatus.FAILED && (
                            <DangerIcon className="fill-error w-5" />
                          )}
                        </td>
                        <td
                          className="text-white hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOperation(operation.id);
                          }}
                        >
                          <CgTrash />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};
