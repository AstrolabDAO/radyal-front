
import { Network, Icon } from "~/utils/interfaces";
import { FaLongArrowAltRight } from "react-icons/fa";

import IconCard from "~/components/IconCard";

type SwapRouteDetailLineProps = {
  step: {
    fromNetwork: Network;
    fromAmount: string;
    toNetwork: Network;
    toAmount: string;
    protocolName: string;
    protocolIcon: Icon;
    type: string;
    swapRouteStepType: string;
  }
};

const SwapRouteDetailLine = ({
  step: {
    fromNetwork,
    fromAmount,
    toNetwork,
    toAmount,
    protocolName,
    protocolIcon,
    type,
    swapRouteStepType,
  }
}: SwapRouteDetailLineProps) => {
  const size = { width: 15, height: 15 };
  const classes = "ms-2";
  const [fromNetworkName] = fromNetwork.name.split(' ');
  const [toNetworkName] = toNetwork.name.split(' ');
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
          { fromAmount }:{ fromNetworkName }
          <IconCard icon={{ url: fromNetwork.icon, size, classes }} />
          <FaLongArrowAltRight className="mx-2" />
          { toAmount }:{ toNetworkName }
          <IconCard icon={{ url: toNetwork.icon, size, classes }} />
        </span>
      </div>
    </li>
  )
};

export default SwapRouteDetailLine;