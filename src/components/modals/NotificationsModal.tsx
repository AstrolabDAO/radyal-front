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

  return (
    <div>
      <div>
        {operations.length === 0 && (
          <div className="uppercase text-center text-md mt-12">
            Nothing to report yet
          </div>
        )}
        {operations.length > 0 && (
          <table className="table rounded-xl">
            <thead className="text-secondary">
              <tr>
                {["date", "from", "to", "status", ""].map((header, index) => {
                  return (
                    <th key={`strategy-table-header-${index}`}>{header}</th>
                  );
                })}
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
      </div>
    </div>
  );
};
