import IconCard from "~/components/IconCard";
import { Strategy } from "~/utils/interfaces";
import StrategyTableListItemIcons from "./StrategyTableListItemIcons";
import clsx from "clsx";
import { openModal } from "~/services/modal";
import { selectStrategy } from "~/services/strategies";
import { selectGroup } from "~/store/strategies";
import { toPercent } from "~/utils/format";

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
  const w1 = (strategy.apy / 100 ) / 365 * 7;
  return (
    <tr
      className={clsx(
        "border-t-1 border-solid border-darkGrey cursor-pointer bordered-hover",
        isLast && "rounded-b-xl"
      )}
      onClick={() => {
        selectGroup(strategyGroup);
        selectStrategy(strategy);
        openModal({ modal: "swap", showTitle: false });
      }}
    >
      <td className="pe-0 text-center">
        <IconCard icon={icon} />
      </td>
      <td className="text-white">{strategy.name}</td>
      <td className="text-white font-semibold">{toPercent(strategy.apy / 100)}</td>
      <td className="text-white">${strategy.tvl}</td>
      <td>
        {protocolsIcons.map((icon) =>
          IconCard({ icon: { url: icon, size: { width: 24, height: 24 } } })
        )}
      </td>
      <td>
        <StrategyTableListItemIcons strategyGroup={strategyGroup} />
      </td>
      <td className="text-success">{toPercent(w1)}</td>
    </tr>
  );
};

export default StrategyTableListItem;
