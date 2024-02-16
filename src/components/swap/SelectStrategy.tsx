import clsx from "clsx";
import {
  useSelectedStrategy,
  useSelectedStrategyGroup,
} from "~/hooks/strategies";
import { useInteraction } from "~/hooks/swapper";
import { selectStrategy } from "~/services/strategies";
import { selectToken } from "~/services/swapper";
import { StrategyInteraction } from "~/utils/constants";
import { toDollarsCompact, toPercent } from "~/utils/format";

import { Strategy } from "~/utils/interfaces";
import { getRandomAPY, getRandomTVL } from "~/utils/mocking";

const SelectStrategy = () => {
  const selectedGroup = useSelectedStrategyGroup();

  const interaction = useInteraction();
  const selectedStrategy: Strategy = useSelectedStrategy();
  const strategies: Array<Strategy> = selectedGroup.map((strategy) => ({
    ...strategy,
    apy: getRandomAPY(strategy.slug),
    tvl: getRandomTVL(strategy.slug),
  }));

  return (
    <div className="flex flex-col ps-3 mb-auto">
      <div className="flex flex-row text-left text-xs leading-6">
        <div className="w-8"></div>
        <div className="w-24">APY</div>
        <div className="">TVL</div>
      </div>
      <div
        className="flex flex-col overflow-y-scroll -me-2"
        style={{ maxHeight: "160px" }}
      >
        {strategies.map((strategy, index) => {
          const isSelected =
            selectedStrategy?.network.id === strategy.network.id;
          return (
            <div
              key={`${strategy.network.id}-${index}`}
              className={clsx("rounded-full my-1 cursor-pointer", {
                "bg-dark-550": isSelected,
                "cursor-pointer bordered-hover": !isSelected,
              })}
              onClick={() => {
                selectStrategy(strategy);
                selectToken({
                  token: strategy,
                  for:
                    interaction === StrategyInteraction.DEPOSIT ? "to" : "from",
                });
              }}
            >
              <div className="flex flex-row items-center my-0.5 text-left">
                <div className="pl-1 w-8">
                  <img
                    className="h-5 w-5"
                    src={strategy.network.icon}
                    alt={strategy.network.slug}
                  />
                </div>
                <div
                  className={clsx("w-24 text-white", {
                    "font-bold": isSelected,
                  })}
                >
                  {toPercent(strategy.apy)}
                </div>
                <div className={clsx("font-light pr-2", "text-white")}>
                  {toDollarsCompact(strategy.tvl)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectStrategy;
