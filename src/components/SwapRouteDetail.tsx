import clsx from "clsx";
import { useMemo } from "react";
import { getTokenBySlug } from "~/services/tokens";

import { Icon } from "~/utils/interfaces";
import { weiToAmount, round, stripName } from "~/utils/format";

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

  function getProtocolIconAndName(protocol: string) {
    const protocolName = stripName(SwaptoolTraduction[protocol] ?? protocol);
    const protocolData = protocolByStrippedSlug[protocolName];
    return {
      protocolName,
      protocolIcon: {
        url: protocolData?.icon,
        classes: "ms-1.5",
        size: { width: 20, height: 20 },
      }
    } as { protocolName: string, protocolIcon: Icon };
  }

  const displayedSteps = useMemo(() => {
    let shouldAssignLoadingStatus = true;
    return steps.map(({ id, type, via, tool, estimate, toChain, fromToken, toToken, fromChain, status }) => {
      const fromAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(
        fromChain,
        estimate?.fromAmount,
        fromToken
      );
      const toAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(
        toChain,
        estimate?.toAmount,
        toToken
      );

      const { protocolName, protocolIcon } = getProtocolIconAndName(tool);

      const displayedStep = {
        id,
        fromNetwork: networkByChainId[fromChain],
        toNetwork: networkByChainId[toChain],
        protocolName,
        protocolIcon,
        type,
        via,
        swapRouteStepType: SwapRouteStepTypeTraduction[type] ?? type,
        fromAmountWithNetworkAndSymbol,
        toAmountWithNetworkAndSymbol,
        status: "neutral" as SwapRouteDetailLineStatus,
      };
      console.log(getTokenBySlug(fromToken?.symbol), getTokenBySlug(toToken?.symbol))
      if (showStatus) {
        if (status === OperationStatus.FAILED) {
          shouldAssignLoadingStatus = false;
        }
        if (status === OperationStatus.WAITING && shouldAssignLoadingStatus) {
          Object.assign(displayedStep, { status: "loading" });
          shouldAssignLoadingStatus = false;
        } else Object.assign(displayedStep, { status: getStatus(status) });
      }
      return displayedStep;
    });
  }, [steps, showStatus]);

  return (
    <div className={clsx({ 'max-h-0': steps.length  === 0 && !estimationError })}>
      {(steps.length > 0 || estimationError) && !showStatus && (
        <div className="mb-1 font-medium text-gray-500">VIA</div>
      )}
      {!estimationError && (
        <ul
          className="steps steps-vertical gap-0"
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
