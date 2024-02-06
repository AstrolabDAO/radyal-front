import { Strategy } from "~/utils/interfaces";
import IconCard  from "../../IconCard";

type StrategyTableListItemIconsProps = {
  strategyGroup: Strategy[];
  size?: { height: number, width: number };
}

const StrategyTableListItemIcons = ({
  strategyGroup, size
}: StrategyTableListItemIconsProps) => {
  const { height, width } = size || { height: 20, width: 20 };
  return (
    <div className="flex items-center ps-3">
      <div className={"flex flex-row"} >
        { strategyGroup.slice(0,5).map((strategy, index) => {
          return (
            <div
              key={`${strategy.network.id}-${index}`}
              className="flex py-1 mx-0.5"
            >
              <IconCard
                icon={{
                  url: strategy.network.icon,
                  alt: strategy.network.name,
                  size: { height, width },
                  classes: "-ms-3"
                }}
              />
            </div>
          );
        })}
        {
          strategyGroup.length > 5 &&
          <div
            style={{ width, height }}
            className="my-auto p-0.5 rounded-full mx-0.5 text-xs text-secondary-400"
          >
            +{strategyGroup.length - 2}
          </div>
        }
      </div>
    </div>
  );
}

export default StrategyTableListItemIcons;