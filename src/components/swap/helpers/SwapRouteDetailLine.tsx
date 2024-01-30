
import { Network, Icon } from "~/utils/interfaces";
import { FaLongArrowAltRight } from "react-icons/fa";

import IconCard from "~/components/IconCard";
import clsx from "clsx";

type SwapRouteDetailLineProps = {
  status?: "neutral" | "success" | "error" | "loading",
  step: {
    fromNetwork: Network;
    toNetwork: Network;
    protocolName: string;
    protocolIcon: Icon;
    type: string;
    swapRouteStepType: string;
    fromAmountWithNetworkAndSymbol: string;
    toAmountWithNetworkAndSymbol: string;
  }
};

const SwapRouteDetailLine = ({
  status = "neutral",
  step: {
    fromNetwork,
    toNetwork,
    protocolName,
    protocolIcon,
    type,
    swapRouteStepType,
    fromAmountWithNetworkAndSymbol,
    toAmountWithNetworkAndSymbol,
  }
}: SwapRouteDetailLineProps) => {
  const size = { width: 15, height: 15 };
  const classes = "ms-2";
  return (
    <li
      className={ clsx(
        "step pb-4",
        status === "neutral" && "step-transparent",
        status === "loading" && "step-transparent step-loading",
        status === "success" && "step-success validated",
        status === "error" && "step-error failed",
      )}
    >
      <div className="w-full flex flex-col text-start">
        <div
          className={ clsx(
          "font-bold flex flex-row",
          status === "neutral" && "text-primary",
          status === "success" && "text-success",
          status === "error" && "text-error",
        )}
        >
          <div className="flex items-center">
            { swapRouteStepType }
          </div>
          { (type === "cross" || type === "swap") && (
            <div className="flex items-center text-white mx-1 font-normal">
              <div>
                with <span className="capitalize"> { protocolName } </span>
              </div>
              { protocolIcon.url && ( <IconCard icon={ protocolIcon } /> ) }
            </div>
            )
          }
        </div>
        <span className="flex items-center text-xs">
          { fromAmountWithNetworkAndSymbol }
          <IconCard icon={{ url: fromNetwork.icon, size, classes }} />
          { (type !== "Approve" && type !== "custom")  &&
            <>
              <FaLongArrowAltRight className="mx-2" />
              { toAmountWithNetworkAndSymbol}
              <IconCard icon={{ url: toNetwork.icon, size, classes }} />
            </>
          }
        </span>
      </div>
    </li>
  )
};

export default SwapRouteDetailLine;