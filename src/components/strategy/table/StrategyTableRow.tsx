import clsx from "clsx";
import IconCard from "~/components/IconCard";
import { Strategy } from "~/model/strategy";
import { openModal } from "~/services/modal";
import { selectStrategy } from "~/services/strategies";
import { selectGroup } from "~/store/strategies";
import { toPercent, toDollarsAuto } from "~/utils/format";
import StrategyTableRowIcons from "./StrategyTableRowIcons";

type StrategyTableRowProps = {
  isLast?: boolean;
  holding: number;
  apy: number;
  strategyGroup: Strategy[];
  folio?: boolean;
};

const StrategyTableRow = ({
  strategyGroup,
  holding,
  apy,
  isLast,
  folio = false,
}: StrategyTableRowProps) => {
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
  const w1 = (apy / 365) * 7;
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
      <td className="text-white">{strategy.name}</td>
      <td className="text-white font-semibold">{toPercent(apy)}</td>
      <td className="text-white">{toDollarsAuto(holding)}</td>
      <td className="pe-0">
        <IconCard icon={icon} />
      </td>
      <td>
        {protocolsIcons.map((icon) =>
          IconCard({ icon: { url: icon, size: { width: 24, height: 24 } } })
        )}
      </td>
      <td>
        <StrategyTableRowIcons strategyGroup={strategyGroup} />
      </td>
      <td className="text-success">{toPercent(w1)}</td>
    </tr>
  );
};

export default StrategyTableRow;
