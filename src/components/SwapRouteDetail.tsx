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
import { IToken as LiFiToken } from "@astrolabs/swapper/dist/src/LiFi";
import { IToken as SquidToken} from "@astrolabs/swapper/dist/src/Squid";

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

    function amountWithNetworkAndSymbol(chain: number, amount: string, token: LiFiToken | SquidToken) {
      const network = networkByChainId[chain];
      const amountFormatted = lisibleAmount(amountToEth(estimate[amount], token?.decimals), 4);
      const symbol = token?.symbol ?? "";
      return `${amountFormatted} ${network?.name.toLowerCase()}:${symbol}`;
    }

    const fromNetwork = networkByChainId[fromChain];
    const fromAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(fromChain, "fromAmount", fromToken);

    const toNetwork = networkByChainId[toChain];
    const toAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(toChain, "toAmount", toToken);

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
      toNetwork,
      protocolName,
      protocolIcon,
      type,
      swapRouteStepType,
      fromAmountWithNetworkAndSymbol,
      toAmountWithNetworkAndSymbol,
    };
  })
  return (
    <div>
      { (steps.length > 0 || estimationError) && (
        <h2>VIA</h2>
      )}
      {!estimationError && (
        <ul
          className="steps steps-vertical"
          style={{
            maxHeight: steps.length > 0 ? "500px" : "0px",
            transition: "max-height 2s ease-out"
          }}
        >
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
