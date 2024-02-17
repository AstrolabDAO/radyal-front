import { Strategy } from "~/utils/interfaces";
import StrategyTableListItem from "./StrategyTableListItem";

type StrategyTableProps = {
  strategies: Strategy[][];
};

const StrategyTable: React.FC<StrategyTableProps> = ({
  strategies,
}: StrategyTableProps) => {
  return (
    <table className="table border-darkGrey rounded-xl">
      <thead className="text-secondary">
        <tr>
          <th className="pe-0"></th>
          <th>Vault</th>
          <th className="font-semibold">APY</th>
          <th>TVL</th>
          <th>Protocols</th>
          <th>Chains</th>
          <th>7d</th>
        </tr>
      </thead>
      <tbody>
        {strategies.map((group, index) => {
          return (
            <StrategyTableListItem
              strategyGroup={group}
              key={`strategy-table-list-${index}`}
              isLast={index === strategies.length - 1}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default StrategyTable;
