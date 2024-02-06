import {
  useSelectStrategy,
  useSelectedStrategyGroup,
} from "~/hooks/store/strategies";
import { useSelectToken } from "~/hooks/store/swapper";

import { Strategy } from "~/utils/interfaces";

const DepositSelectNetwork = () => {
  const selectedGroup = useSelectedStrategyGroup();
  const selectStrategy = useSelectStrategy();
  const selectToken = useSelectToken();
  const strategies: Array<Strategy & { apy: string; tvl: string }> =
    selectedGroup.map((strategy) => ({
      ...strategy,
      apy: "25",
      tvl: "22.3",
    }));
  return (
    <div className="flex flex-col md:basis-2/5 ps-3 mt-6 mb-auto">
      <div className="flex flex-row text-center text-xs">
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
              className="hover:bg-dark-550 rounded-full my-1 cursor-pointer"
              onClick={() => {
                selectStrategy(strategy);
                selectToken({
                  token: strategy,
                  for: "to",
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
                <div className="basis-1/3 font-bold">{strategy.apy}%</div>
                <div className="basis-1/3 font-light pe-1">{strategy.tvl}M</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepositSelectNetwork;
