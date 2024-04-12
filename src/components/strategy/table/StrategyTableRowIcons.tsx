import { Strategy } from "~/utils/interfaces";
import IconCard from "../../IconCard";

type StrategyTableRowIconsProps = {
  strategyGroup: Strategy[];
  size?: { height: number; width: number };
  networks?: boolean;
};

const StrategyTableRowIcons = ({
  strategyGroup,
  size,
  networks = true, // networks or protocols
}: StrategyTableRowIconsProps) => {
  const { height, width } = size || { height: 20, width: 20 };

  // Function to generate unique items based on a key function
  const uniqueBy = (array, key) => {
    const seen = new Map();
    return array.filter((item) => {
      const uniqueKey = key(item);
      return seen.has(uniqueKey) ? false : seen.set(uniqueKey, true);
    });
  };

  // Select icons and tooltips based on the networks prop
  const items = networks
    ? strategyGroup.map((strategy) => ({
        icon: strategy.network.icon,
        name: strategy.network.name,
        id: strategy.network.id,
      }))
    : uniqueBy(
        strategyGroup.flatMap((strategy) =>
          strategy.protocols.map((p) => ({
            icon: p.icon,
            name: p.name,
            id: p.slug,
          }))
        ),
        (p) => p.id // Ensure uniqueness by protocol slug
      );

  const tooltipText = items.map((item) => item.name).join("\n");

  return (
    <div className="flex items-center ps-3">
      <div
        className={"flex flex-row tooltip tooltip-bottom"}
        data-tip={tooltipText}
      >
        {items.slice(0, 5).map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex py-1 mx-0.5">
            <IconCard
              icon={{
                url: item.icon,
                alt: item.name,
                size: { height, width },
                classes: "-ms-3",
              }}
            />
          </div>
        ))}
        {items.length > 5 && (
          <div
            style={{ width, height }}
            className="my-auto p-0.5 rounded-full mx-0.5 text-xs"
          >
            +{items.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyTableRowIcons;
