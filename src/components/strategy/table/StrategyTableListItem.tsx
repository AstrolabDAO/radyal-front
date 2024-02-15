import IconCard from "~/components/IconCard";
import { Strategy } from "~/utils/interfaces";
import StrategyTableListItemIcons from "./StrategyTableListItemIcons";
import clsx from "clsx";
import { openModal } from "~/services/modal";
import { selectStrategy } from "~/services/strategies";
import { selectGroup } from "~/store/strategies";

type StrategyTableListItemProps = {
  isLast?: boolean;
  strategyGroup: Strategy[];
};

const StrategyTableListItem = ({
  strategyGroup,
  isLast,
}: StrategyTableListItemProps) => {
  const [strategy] = strategyGroup;

  const protocolsIcons = Array.from(
    new Set(
      strategyGroup
        .map((strategy) => strategy.protocols.map((protocol) => protocol.icon))
        .flat(1)
    )
  );
  const icon = {
    size: { width: 24, height: 24 },
    url: strategy.asset.icon,
  };
  return (
    <tr
      className={clsx(
        "border-t-1 border-solid border-dark-600 hover:bg-base cursor-pointer",
        isLast && "rounded-b-xl"
      )}
      onClick={() => {
        selectGroup(strategyGroup);
        selectStrategy(strategy);
        openModal({ modal: "swap" });
      }}
    >
      <td className="pe-0 text-center">
        <IconCard icon={icon} />
      </td>
      <td className="text-white">{strategy.name}</td>
      <td className="text-white font-semibold">12%</td>
      <td className="text-white">12%</td>
      <td>
        {protocolsIcons.map((icon) =>
          IconCard({ icon: { url: icon, size: { width: 24, height: 24 } } })
        )}
      </td>
      <td>
        <StrategyTableListItemIcons strategyGroup={strategyGroup} />
      </td>
      <td className="text-success">+ .12%</td>
    </tr>
  );
};

export default StrategyTableListItem;
