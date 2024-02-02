
import clsx from "clsx";

import { Network, Icon } from "~/utils/interfaces";
import { FaLongArrowAltRight } from "react-icons/fa";

import IconCard from "~/components/IconCard";

type SwapRouteDetailLineProps = {
  status?: "neutral" | "success" | "error" | "loading",
  step: {
    via: string,
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
    via,
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
  const classes = "ms-1.5";
  const viaIcon = { url: via ? `/images/protocols/${via.toLowerCase()}.svg` : null, size: {
    width: 20,
    height: 20,
  }, classes: "ms-1.5 my-auto" };
  return (
    <li
      className={ clsx(
        "step",
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
            <div className="flex items-center text-secondary mx-1 font-normal">
              <div>
                with <span className="capitalize"> { protocolName } </span>
              </div>
              { protocolIcon.url && ( <IconCard icon={ protocolIcon } /> ) }
              { (type === "cross" || type === "swap") && viaIcon.url && (
                <div className="flex justify-center">&nbsp;via { via }
                  <IconCard icon={ viaIcon } />
                </div>
                )
              }
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
              { toAmountWithNetworkAndSymbol }
              <IconCard icon={{ url: toNetwork.icon, size, classes }} />
            </>
          }
        </span>
      </div>
    </li>
  )
};

export default SwapRouteDetailLine;