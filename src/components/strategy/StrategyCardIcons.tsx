import { Strategy } from "~/utils/interfaces";
import IconCard  from "../IconCard";

type StrategyCardIconsProps = {
  strategyGroup: Strategy[];
}

const StrategyCardIcons = ({ strategyGroup }: StrategyCardIconsProps) => {
  return (
    <div className="flex w-full justify-end items-center">
      <span className="mr-2">ON</span>
      <div
        className={"flex flex-row border border-solid border-gray-500 rounded-3xl"}
      >
        { strategyGroup.map((strategy, index) => {
          return (
            <div
              key={`${strategy.network.id}-${index}`}
              className="flex py-1 mx-1"
            >
              <IconCard
                icon={{
                  url: strategy.network.icon,
                  alt: strategy.network.name,
                  size: { width: 20, height: 20 },
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StrategyCardIcons;