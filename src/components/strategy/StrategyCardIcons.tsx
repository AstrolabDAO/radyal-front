import { Strategy } from "~/utils/interfaces";
import IconCard  from "../IconCard";

type StrategyCardIconsProps = {
  strategyGroup: Strategy[];
  hideLabel?: boolean;
  size?: { height: number, width: number };
}

const StrategyCardIcons = ({
  strategyGroup, size, hideLabel,
}: StrategyCardIconsProps) => {
  const { height, width } = size || { height: 20, width: 20 };
  return (
    <div className="flex justify-end items-center">
      {!hideLabel && (
        <span className="mr-2">ON</span>
      )}
      <div
        className={"flex flex-row border border-solid border-gray-500 rounded-3xl px-0.5"}
      >
        { strategyGroup.slice(0,2).map((strategy, index) => {
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
                }}
              />
            </div>
          );
        })}
        {
          strategyGroup.length > 2 &&
          <div
            style={{ width, height }}
            className="my-auto p-0.5 bg-white rounded-xl mx-0.5 text-xs"
          >
            +{strategyGroup.length - 2}
          </div>
        }
      </div>
    </div>
  );
}

export default StrategyCardIcons;