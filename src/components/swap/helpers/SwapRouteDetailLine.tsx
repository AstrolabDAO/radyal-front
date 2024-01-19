
import { Network, Icon } from "~/utils/interfaces";
import { FaLongArrowAltRight } from "react-icons/fa";

import IconCard from "~/components/IconCard";

type SwapRouteDetailLineProps = {
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
    <li className="step step-primary pb-4">
      <div className="w-full flex flex-col text-start">
        <div className="text-primary font-bold flex flex-row">
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
        <span className="flex items-center">
          { fromAmountWithNetworkAndSymbol }
          <IconCard icon={{ url: fromNetwork.icon, size, classes }} />
          <FaLongArrowAltRight className="mx-2" />
          { toAmountWithNetworkAndSymbol}
          <IconCard icon={{ url: toNetwork.icon, size, classes }} />
        </span>
      </div>
    </li>
  )
};

export default SwapRouteDetailLine;