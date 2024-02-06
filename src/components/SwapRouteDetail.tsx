import { useMemo } from "react";
import { round, weiToAmount } from "~/utils/format";
import { Icon, Protocol } from "~/utils/interfaces";

import {
  SwapRouteStepTypeTraduction,
  SwaptoolTraduction,
  networkByChainId,
  protocolByStrippedSlug,
} from "~/utils/mappings";

import { IToken as LiFiToken } from "@astrolabs/swapper/dist/src/LiFi";
import { IToken as SquidToken } from "@astrolabs/swapper/dist/src/Squid";
import { useEstimatedRoute } from "~/hooks/store/swapper";
import { OperationStatus, OperationStep } from "~/store/interfaces/operations";
import SwapRouteDetailLine from "./swap/helpers/SwapRouteDetailLine";

type SwapRouteDetailProps = {
  steps: OperationStep[];
  showStatus?: boolean;
};
type SwapRouteDetailLineStatus = "neutral" | "success" | "error" | "loading";

const SwapRouteDetail = ({
  steps,
  showStatus = false,
}: SwapRouteDetailProps) => {
  const estimation = useEstimatedRoute();

  const estimationError = estimation?.error;
  function getStatus(status: OperationStatus): SwapRouteDetailLineStatus {
    switch (status) {
      case OperationStatus.PENDING:
        return "loading";
      case OperationStatus.DONE:
        return "success";
      case OperationStatus.FAILED:
        return "error";
      default:
        return "neutral";
    }
  }

  function amountWithNetworkAndSymbol(
    chain: number,
    amount: string,
    token: LiFiToken | SquidToken
  ) {
    const network = networkByChainId[chain];
    const amountFormatted = round(weiToAmount(amount, token?.decimals), 4);
    const symbol = token?.symbol ?? "???";
    let networkName = network?.name ?? "???";
    if (networkName === "Gnosis Chain-Mainnet") networkName = "Gnosis Chain";
    return `${amountFormatted} ${symbol}`;
  }

  const displayedSteps = useMemo(() => {
    let haveWaitingStepCreated = false;

    return steps.map((step) => {
      const {
        id,
        type,
        tool,
        estimate,
        toChain,
        fromToken,
        toToken,
        fromChain,
        status,
      } = step;

      const fromNetwork = networkByChainId[fromChain];
      const fromAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(
        fromChain,
        estimate?.fromAmount,
        fromToken
      );

      const toNetwork = networkByChainId[toChain];
      const toAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(
        toChain,
        estimate?.toAmount,
        toToken
      );

      const swapRouteStepType = SwapRouteStepTypeTraduction[type] ?? type;

      const convertedTool = SwaptoolTraduction[tool] ?? tool;
      const protocol: Protocol = protocolByStrippedSlug[convertedTool];
      const protocolIcon: Icon = {
        url: protocol?.icon,
        classes: "ms-2",
        size: { width: 20, height: 20 },
      };
      const protocolName = protocol?.name ?? convertedTool;
      const displayedStep = {
        id,
        fromNetwork,
        toNetwork,
        protocolName,
        protocolIcon,
        type,
        swapRouteStepType,
        fromAmountWithNetworkAndSymbol,
        toAmountWithNetworkAndSymbol,
        status: "neutral" as SwapRouteDetailLineStatus,
      };
      if (showStatus) {
        if (status === OperationStatus.WAITING && !haveWaitingStepCreated) {
          Object.assign(displayedStep, { status: "loading" });
          haveWaitingStepCreated = true;
        } else Object.assign(displayedStep, { status: getStatus(status) });
      }
      return displayedStep;
    });
  }, [steps, showStatus]);

  return (
    <div>
      {(steps.length > 0 || estimationError) && !showStatus && (
        <div className="mb-1">VIA</div>
      )}
      {!estimationError && (
        <ul
          className="steps steps-vertical"
          style={{
            maxHeight: steps.length > 0 ? "500px" : "0px",
            transition: "max-height 2s ease-out",
          }}
        >
          {displayedSteps.map((step) => (
            <SwapRouteDetailLine
              key={`swap-route-detail-${step.id}`}
              step={step}
              status={step.status}
            />
          ))}
        </ul>
      )}
      {estimationError && (
        <div className="border-1 border-solid border-warning w-full py-2 rounded-xl bg-warning/10 mb-3">
          <div className="text-center text-primary font-medium leading-5">
            No route found ! <br />
            Please select another deposit token
          </div>
        </div>
      )}
    </div>
  );
};
export default SwapRouteDetail;
