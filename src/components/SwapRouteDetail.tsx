import { useContext } from "react";
import { amountToEth, lisibleAmount } from "~/utils/format";
import { Icon, Protocol } from "~/utils/interfaces";

import {
  SwapRouteStepTypeTraduction,
  SwaptoolTraduction,
  networkByChainId,
  protocolByStrippedSlug,
} from "~/utils/mappings";

import { EstimationContext } from "~/context/estimation-context";
import { OperationStep } from "~/store/interfaces/operations";
import SwapRouteDetailLine from "./swap/helpers/SwapRouteDetailLine";

const SwapRouteDetail = ({ steps }: { steps: OperationStep[] }) => {
  const { estimationError } = useContext(EstimationContext);

  const displayedSteps = steps.map((step) => {
    const {
      id,
      type,
      tool,
      estimate,
      toChain,
      fromToken,
      toToken,
      fromChain,
    } = step;

    const fromNetwork = networkByChainId[fromChain];
    const fromAmount = `${lisibleAmount(
      amountToEth(estimate.fromAmount, fromToken?.decimals),
      4
    )} ${fromToken?.symbol}`;

    const toNetwork = networkByChainId[toChain];
    const toAmount = `${lisibleAmount(
      amountToEth(estimate.toAmount, toToken?.decimals),
      4
    )} ${toToken?.symbol}`;


    const swapRouteStepType = SwapRouteStepTypeTraduction[type] ?? type;

    const convertedTool = SwaptoolTraduction[tool] ?? tool;
    const protocol: Protocol = protocolByStrippedSlug[convertedTool];
    const protocolIcon: Icon = {
      url: protocol?.icon,
      classes: "ms-2",
      size: { width: 20, height: 20 },
    };
    const protocolName = protocol?.name ?? convertedTool;
    return {
      id,
      fromNetwork,
      fromAmount,
      toNetwork,
      toAmount,
      protocolName,
      protocolIcon,
      type,
      swapRouteStepType,
    };
  })
  return (
    <div>
      <h2 className="">VIA </h2>
      {!estimationError && (
        <ul className="steps steps-vertical">
          { displayedSteps.map((step) =>
              <SwapRouteDetailLine
                key={`swap-route-detail-${step.id}`}
                step={ step }
              />
            )
          }
        </ul>
      )}
      { estimationError && (
        <div className="border-2 border-solid border-primary w-full py-6 rounded-xl bg-primary/10">
          <div className="text-center text-primary font-bold">
            { estimationError }
          </div>
        </div>
      )}
    </div>
  );
};
export default SwapRouteDetail;
