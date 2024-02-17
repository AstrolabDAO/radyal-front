import { IToken as LiFiToken } from "@astrolabs/swapper/dist/src/LiFi";
import { IToken as SquidToken } from "@astrolabs/swapper/dist/src/Squid";
import clsx from "clsx";
import { useCallback, useContext, useMemo } from "react";

import {
  useCanSwap,
  useEstimatedRoute,
  useEstimationOnProgress,
} from "~/hooks/swapper";
import { Icon, Token } from "~/utils/interfaces";

import { clearFrom, stripName, toFloatAuto } from "~/utils/format";
import { round, weiToAmount } from "~/utils/maths";

import {
  SwapRouteStepTypeTraduction,
  SwaptoolTraduction,
  networkByChainId,
  protocolBySlug,
  protocolByStrippedSlug,
  protocolByThirdPartyId,
} from "~/utils/mappings";

import { OperationStatus } from "@astrolabs/swapper";
import Loader from "~/components/Loader";
import { Operation } from "~/model/operation";
import ActionRouteDetailLine from "./ActionRouteDetailLine";
import { Web3Context } from "~/context/web3-context";
import { findClosestMatch } from "~/utils";

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
  const { protocols } = useContext(Web3Context);

  const amountWithNetworkAndSymbol = useCallback(
    (chain: number, amount: string, token: Token) => {
      const network = networkByChainId[chain];
      const amountFormatted = toFloatAuto(weiToAmount(amount, token?.decimals), false, 2);
      const symbol = token?.symbol ?? "???";
      let networkName = network?.name ?? "???";
      networkName = clearFrom(networkName, "-Mainnet|-Testnet");
      return `${amountFormatted} ${symbol}`;
    },
    []
  );

  const getProtocolIconAndName = useCallback((id: string) => {
    const protocol = {
      // protocolName,
      protocolIcon: {
        // url: protocolData?.icon,
        classes: "ms-1.5",
        size: { width: 20, height: 20 },
      } as Icon,
    };

    let p = protocolByThirdPartyId[id];

    if (!p) {
      const slug = findClosestMatch(
        id,
        protocols.map((p) => p.slug)
      );
      if (!slug) return { protocolName: id, protocolIcon: null };
      p = protocolBySlug[slug];
    }
    const protocolName = stripName(
      SwaptoolTraduction[id] ?? p.name ?? id ?? "custom"
    );
    p ??= protocolByStrippedSlug[protocolName];

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

        const { protocolName, protocolIcon } = getProtocolIconAndName(tool ?? type);

        const displayedStep = {
          id,
          fromNetwork: networkByChainId[fromChain],
          toNetwork: networkByChainId[toChain],
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
                step={step}
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
