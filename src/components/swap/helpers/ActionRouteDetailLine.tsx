import clsx from "clsx";

import { Operation, OperationStatus } from "~/model/operation";

import { Network, Icon, Token } from "~/utils/interfaces";
import { FaLongArrowAltRight } from "react-icons/fa";

import IconCard from "~/components/IconCard";
import { useEffect } from "react";
import { capitalize } from "~/utils/format";

type ActionRouteDetailLineProps = {
  status?: OperationStatus | "NEUTRAL";
  operation: Operation;
  step: {
    via: string;
    fromNetwork: Network;
    toNetwork: Network;
    fromToken: Token;
    toToken: Token;
    protocolName: string;
    protocolIcon: Icon;
    type: string;
    swapRouteStepType: string;
    fromAmountWithNetworkAndSymbol: string;
    toAmountWithNetworkAndSymbol: string;
  };
};

const ActionRouteDetailLine = ({
  status = "NEUTRAL",
  operation,
  step: {
    via,
    protocolIcon,
    protocolName,
    fromNetwork,
    fromToken,
    toToken,
    toNetwork,
    type,
    swapRouteStepType,
    fromAmountWithNetworkAndSymbol,
    toAmountWithNetworkAndSymbol,
  },
}: ActionRouteDetailLineProps) => {
  const size = { width: 15, height: 15 };
  const classes = "ms-1.5";
  const viaIcon = {
    url: via ? `/images/protocols/${via.toLowerCase()}.svg` : null,
    size: {
      width: 20,
      height: 20,
    },
    classes: "ms-1.5 my-auto",
  };
  return (
    <li
      className={clsx(
        "step",
        status === "NEUTRAL" && "step-transparent",
        status === OperationStatus.WAITING && "step-transparent step-loading",
        status === OperationStatus.DONE && "step-success validated",
        status === OperationStatus.FAILED && "step-error failed"
      )}
    >
      <div className="w-full flex flex-col text-start">
        <div
          className={clsx(
            "font-bold flex flex-row",
            status === OperationStatus.DONE && "text-success",
            status === OperationStatus.FAILED && "text-error"
          )}
        >
          <div className="flex items-center text-primary">{capitalize(swapRouteStepType)}</div>
          {(type == "cross" || type == "swap" || type == "bridge") && (
            <div className="flex items-center mx-1 font-normal">
              <div>
                with <span className="capitalize">{protocolName}</span>
              </div>
              {protocolIcon.url && <IconCard icon={protocolIcon} />}
              {(type == "cross" || type == "swap" || type == "bridge") && viaIcon.url && (
                <div className="flex justify-center ml-2">
                  via {capitalize(via.toLowerCase())}
                  <IconCard icon={viaIcon} />
                </div>
              )}
            </div>
          )}
        </div>
        <span className="flex items-center">
          {fromAmountWithNetworkAndSymbol}
          <IconCard icon={{ url: fromToken?.icon ?? (fromToken as any).logoURI, size, classes }} />
          &nbsp;on
          <IconCard icon={{ url: fromNetwork?.icon ?? (fromToken as any).logoURI, size, classes }} />
          {type !== "approve" && (
            <>
              <FaLongArrowAltRight className="mx-2" />
              {toAmountWithNetworkAndSymbol}
              <IconCard icon={{ url: toToken?.icon ?? (toToken as any).logoURI, size, classes }} />
              &nbsp;on
              <IconCard icon={{ url: toNetwork?.icon ?? (toToken as any).logoURI, size, classes }} />
            </>
          )}
        </span>
      </div>
    </li>
  );
};

export default ActionRouteDetailLine;
