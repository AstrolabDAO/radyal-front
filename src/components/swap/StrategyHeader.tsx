import { getIconFromStrategy } from "~/utils";
import { Strategy } from "~/utils/interfaces";
import SelectStrategy from "./SelectStrategy";

type StrategyHeaderProps = {
  strategy: Strategy;
};

const StrategyHeader = ({ strategy }: StrategyHeaderProps) => {
  const { name } = strategy;
  const [title, subtitle] = name.replace("Astrolab ", "").split(" ");
  const description = `Algorithmically provides liquidity across stable pools on ${title}.`;
  const strategyIconPath = getIconFromStrategy(strategy).replace(
    ".svg",
    "-mono.svg"
  );
  return (
    <div className="md:basis-3/5 text-white">
      <div className="mb-1 text-gray-500 font-medium">INTO</div>
      <div className="flex">
        <div className="flex flex-col m-0 p-3 border border-solid border-dark-500 rounded-3xl relative overflow-hidden flex-1">
          <div className="absolute inset-0 flex justify-end items-center z-0 overflow-hidden contrast-[0.7] -mr-16">
            <img
              src={strategyIconPath}
              className="h-52 w-52 strategy-icon-filter"
            />
          </div>
          <div className="relative z-10 px-2">
            <div className="font-bold italic text-3xl -mb-1 uppercase gilroy">
              {title}
            </div>
            <div className="font-light text-xl gilroy"> {subtitle} </div>
            <div className="text-xs leading-3 text-gray font-extralight">
              {description}
              <br />
              <br />
              Claiming of reward tokens, rebalancing and compounding is
              automated.
            </div>
          </div>
        </div>
        <SelectStrategy />
      </div>
    </div>
  );
};

export default StrategyHeader;
