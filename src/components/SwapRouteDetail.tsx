import { useContext } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { amountToEth, lisibleAmount } from "~/utils/format";
import { Protocol } from "~/utils/interfaces";
import {
  SwapRouteStepTypeTraduction,
  SwaptoolTraduction,
  networkByChainId,
  protocolByStrippedSlug,
} from "~/utils/mappings";
import IconCard from "./IconCard";
import { EstimationContext } from "~/context/estimation-context";
import { OperationStep } from "~/store/interfaces/operations";

const SwapRouteDetail = ({ steps }: { steps: OperationStep[] }) => {
  const { estimationError } = useContext(EstimationContext);

  const size = { width: 20, height: 20 };

  if (!steps) return null;
  return (
    <div>
      <h2 className="">VIA </h2>
      <div className="card bg-base-100 flex flex-col mt-4 p-4">
        {estimationError && estimationError}
        {!estimationError && (
          <ul className="icon-steps icon-steps-vertical">
            {steps.map((step) => {
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
              const toNetwork = networkByChainId[toChain];

              const fromAmount = `${lisibleAmount(
                amountToEth(estimate.fromAmount, fromToken?.decimals),
                4
              )} ${fromToken?.symbol}`;

              const toAmount = `${lisibleAmount(
                amountToEth(estimate.toAmount, toToken?.decimals),
                4
              )} ${toToken?.symbol}`;

              const convertedTool = SwaptoolTraduction[tool] ?? tool;
              const protocol: Protocol = protocolByStrippedSlug[convertedTool];
              return (
                <li className="icon-step" key={`stepper-${id}`}>
                  <div className="icon w-50">
                    <IconCard
                      icon={{
                        url: protocol?.icon,
                        size: { width: 30, height: 30 },
                      }}
                    />
                  </div>
                  <div className="content w-full p-2">
                    <div className="block w-full" key={id}>
                      <div className="flex">
                        {SwapRouteStepTypeTraduction[type] ?? type}
                        <span className="mx-2">from</span>
                        <IconCard icon={{ url: fromNetwork.icon, size }} />
                        {fromNetwork.name}
                        {type === "cross" && (
                          <>
                            <span className="mx-2">to</span>
                            <IconCard icon={{ url: toNetwork.icon, size }} />
                            {toNetwork.name}
                          </>
                        )}
                        <span className="mx-2">on</span>
                        <a href={protocol?.app} target="_blank">
                          {protocol?.name ??
                            SwaptoolTraduction[tool] ??
                            convertedTool}
                        </a>
                      </div>
                      <span className="block w-full flex justify-center">
                        {fromAmount}
                        {type !== "Approve" && (
                          <>
                            <FaLongArrowAltRight className="mx-2" />
                            {toAmount}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
export default SwapRouteDetail;
