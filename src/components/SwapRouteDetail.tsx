import { useContext } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { SwapContext } from "~/context/swap-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import { Protocol } from "~/utils/interfaces";
import {
  SwapRouteStepTypeTraduction,
  networkByChainId,
  protocolByStrippedSlug,
} from "~/utils/mappings";
import IconCard from "./IconCard";

const SwapRouteDetail = () => {
  const { steps } = useContext(SwapContext);
  const size = { width: 20, height: 20 };

  return (
    <div>
      <h2 className="">Route details: </h2>
      <div className="card bg-base-100 flex flex-col mt-4 p-4">
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
            console.log(
              "🚀 ~ file: SwapRouteDetail.tsx:41 ~ {steps.map ~ fromAmount:",
              fromAmount
            );

            const toAmount = `${lisibleAmount(
              amountToEth(estimate.toAmount, toToken?.decimals),
              4
            )} ${toToken?.symbol}`;

            const protocol: Protocol = protocolByStrippedSlug[tool];
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
                        {tool}
                      </a>
                    </div>
                    <span className="block w-full flex justify-center">
                      {fromAmount}
                      <FaLongArrowAltRight className="mx-2" />
                      {toAmount}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default SwapRouteDetail;
