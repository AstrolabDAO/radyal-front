import clsx from "clsx";
import { useCallback, useMemo } from "react";

import { useEstimationOnProgress } from "~/hooks/swapper";
import { Icon, Token } from "~/utils/interfaces";

import { clearFrom, stripName, toFloatAuto } from "~/utils/format";
import { weiToAmount } from "~/utils/maths";

import {
  SwapRouteStepTypeTraduction,
  SwaptoolTraduction,
} from "~/utils/mappings";

import { OperationStatus } from "@astrolabs/swapper";
import Loader from "~/components/Loader";

import { useProtocols } from "~/hooks/web3";
import { Network } from "~/model/network";
import { Operation } from "~/model/operation";
import { Protocol } from "~/model/protocol";
import { findClosestMatch } from "~/utils";
import ActionRouteDetailLine from "./ActionRouteDetailLine";

type ActionRouteDetailProps = {
  operation: Operation;
  showStatus?: boolean;
};

const OperationRouteDetail = ({
  operation,
  showStatus = false,
}: ActionRouteDetailProps) => {
  const estimationProgress = useEstimationOnProgress();

  const estimationError = operation?.estimation?.error;
  const steps = useMemo(() => operation.steps, [operation]);
  const protocols = useProtocols();

  const amountWithNetworkAndSymbol = useCallback(
    (chain: number, amount: string, token: Token) => {
      const network = Network.byChainId[chain];
      const amountFormatted = toFloatAuto(
        weiToAmount(amount, token?.decimals),
        false,
        4
      );
      const symbol = token?.symbol ?? "???";
      let networkName = network?.name ?? "???";
      networkName = clearFrom(networkName, "-Mainnet|-Testnet");
      return `${amountFormatted} ${symbol}`;
    },
    []
  );

  const getProtocolIconAndName = useCallback((id: string) => {
    let p = Protocol.byThirdPartyId[id];

    if (!p) {
      const slug = findClosestMatch(
        id,
        protocols.map((p) => p.slug)
      );
      if (!slug) return { protocolName: id, protocolIcon: null };
      p = Protocol.bySlug[slug];
      // add to search cache
      Protocol.byThirdPartyId[id] = p;
    }
    const protocolName = stripName(
      SwaptoolTraduction[id] ?? p.name ?? id ?? "custom"
    );
    p ??= Protocol.byStrippedSlug[protocolName];

    return {
      protocolName: p?.name ?? protocolName,
      protocolIcon: {
        url: p?.icon,
        classes: "ms-1.5",
        size: { width: 20, height: 20 },
      } as Icon,
    };
  }, []);

  const displayedSteps = useMemo(() => {
    let shouldAssignLoadingStatus = true;

    return steps.map(
      ({
        id,
        type,
        via,
        tool,
        estimate,
        toChain,
        fromToken,
        toToken,
        fromChain,
        status,
        fromAmount,
        toAmount,
      }) => {
        const fromAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(
          fromChain,
          fromAmount ?? estimate.fromAmount ?? "0",
          fromToken
        );
        const toAmountWithNetworkAndSymbol = amountWithNetworkAndSymbol(
          toChain,
          toAmount ?? estimate?.toAmount ?? "0",
          toToken
        );

        const { protocolName, protocolIcon } = getProtocolIconAndName(
          tool ?? type
        );

        const displayedStep = {
          id,
          fromNetwork: Network.byChainId[fromChain],
          toNetwork: Network.byChainId[toChain],
          protocolName,
          protocolIcon,
          type,
          via,
          fromToken,
          toToken,
          swapRouteStepType: SwapRouteStepTypeTraduction[type] ?? type,
          fromAmountWithNetworkAndSymbol,
          toAmountWithNetworkAndSymbol,
          status,
        };
        if (showStatus) {
          if (status === OperationStatus.FAILED) {
            shouldAssignLoadingStatus = false;
          }
          if (status === OperationStatus.WAITING) {
            if (shouldAssignLoadingStatus) {
              Object.assign(displayedStep, { status: OperationStatus.WAITING });
              shouldAssignLoadingStatus = false;
            } else {
              Object.assign(displayedStep, { status: "NEUTRAL" });
            }
          }
        }
        return displayedStep;
      }
    );
  }, [steps, showStatus, amountWithNetworkAndSymbol, getProtocolIconAndName]);

  return (
    <Loader
      loaderClasses="w-20 mx-auto invert"
      className="mx-auto text-nowrap text-white mb-4 text-center text-xs"
      title={"SEARCHING ROUTE"}
      value={!(estimationProgress && !operation?.estimation)}
    >
      <div
        className={clsx({ "max-h-0": steps.length === 0 && !estimationError })}
      >
        {(steps.length > 0 || estimationError) && !showStatus && (
          <div className="mb-1 font-medium mt-4">VIA</div>
        )}
        {!estimationError && (
          <ul
            className="steps steps-vertical gap-0"
            style={{
              maxHeight: steps.length > 0 ? "500px" : "0px",
              transition: "max-height 2s ease-out",
            }}
          >
            {displayedSteps.map((step, index) => (
              <ActionRouteDetailLine
                key={`swap-route-detail-${index}`}
                operation={operation}
                step={step as any}
                status={step.status}
              />
            ))}
          </ul>
        )}

        {estimationError && (
          <div className="border-2 border-solid border-warning w-full py-2 rounded-xl bg-warning/10 mb-3">
            <div className="text-center text-primary font-medium leading-5">
              No route found ! <br />
              Please select another deposit token
            </div>
          </div>
        )}
      </div>
    </Loader>
  );
};
export default OperationRouteDetail;
