import clsx from "clsx";
import {
  useSelectStrategy,
  useSelectedStrategy,
  useSelectedStrategyGroup,
} from "~/hooks/store/strategies";
import { useInteraction, useSelectToken } from "~/hooks/store/swapper";
import { StrategyInteraction } from "~/utils/constants";
import {
  toDollarsAuto,
  toDollarsCompact,
  toFloatAuto,
  toFloatCompact,
  toPercent,
} from "~/utils/format";

import { Strategy } from "~/utils/interfaces";
import { getRandomAPY, getRandomTVL } from "~/utils/mocking";

const DepositSelectNetwork = () => {
  const selectedGroup = useSelectedStrategyGroup();
  const selectStrategy = useSelectStrategy();
  const selectToken = useSelectToken();
  const interaction = useInteraction();
  const selectedStrategy: Strategy = useSelectedStrategy();
  const strategies: Array<Strategy> = selectedGroup.map((strategy) => ({
    ...strategy,
    apy: getRandomAPY(strategy.slug),
    tvl: getRandomTVL(strategy.slug),
  }));
  const isSelected = (strategy: Strategy) => {
    return selectedStrategy?.network.id === strategy.network.id;
  };
  return (
    <div className="flex flex-col md:basis-2/5 ps-6 mb-auto">
      <div className="flex flex-row text-center text-xs leading-6">
        <div className="basis-1/3 text-start">CHAIN</div>
        <div className="basis-1/3">APY</div>
        <div className="basis-1/3">TVL</div>
      </div>
      <div
        className="flex flex-col overflow-y-scroll -me-2"
        style={{ maxHeight: "160px" }}
      >
        {strategies.map((strategy, index) => {
          return (
            <div
              key={`${strategy.network.id}-${index}`}
              className={clsx(
                "rounded-full my-1",
                isSelected(strategy) &&
                  "bg-dark-550 border-1 border-solid border-primary/50",
                !isSelected(strategy) && "cursor-pointer hover:bg-dark-550"
              )}
              onClick={() => {
                selectStrategy(strategy);
                selectToken({
                  token: strategy,
                  for:
                    interaction === StrategyInteraction.DEPOSIT ? "to" : "from",
                });
              }}
            >
              <div className="flex flex-row items-center my-0.5 text-center">
                <div className="basis-1/3">
                  <img
                    className="h-5 w-5 ms-1"
                    src={strategy.network.icon}
                    alt={strategy.network.slug}
                  />
                </div>
                <div
                  className={clsx(
                    "basis-1/3 font-bold",
                    isSelected(strategy) ? "text-primary" : "text-white"
                  )}
                >
                  {toPercent(strategy.apy)}
                </div>
                <div
                  className={clsx(
                    "basis-1/3 font-light pe-1",
                    isSelected(strategy) ? "text-primary" : "text-white"
                  )}
                >
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

export default DepositSelectNetwork;
