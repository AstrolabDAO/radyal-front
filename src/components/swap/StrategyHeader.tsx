import { getStrategyIcon } from "~/utils";
import { Strategy } from "~/utils/interfaces";
import SelectStrategy from "./SelectStrategy";

type StrategyHeaderProps = {
  strategy: Strategy;
};

const StrategyHeader = ({ strategy }: StrategyHeaderProps) => {
  const { name } = strategy;
  const [title, subtitle] = name.replace("Astrolab ", "").split(" ");
  const description = `Algorithmically provides liquidity across stable pools on ${title}.`;
  const strategyIconPath = getStrategyIcon(strategy).replace(
    ".svg",
    "-mono.svg"
  );
  return (
    <div className="md:basis-3/5">
      <div className="mb-1 font-medium hidden sm:block">INTO</div>
      <div className="flex flex-wrap sm:flex-nowrap">
        <div className="flex flex-col m-0 p-3 border border-solid border-darkGrey rounded-3xl relative overflow-hidden sm:flex-1 w-full">
          <div className="absolute inset-0 flex justify-end items-center z-0 overflow-hidden contrast-[0.7] -mr-16">
            <img
              src={strategyIconPath}
              className="h-52 w-52 strategy-icon-filter"
            />
          </div>
          <div className="relative z-10 p-2  text-white">
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
