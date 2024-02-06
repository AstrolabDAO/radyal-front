import { Strategy } from "~/utils/interfaces";
import StrategyTableListItem from "./StrategyTableListItem";

type StrategyTableProps = {
    strategies: Strategy[][];
};

const StrategyTable: React.FC<StrategyTableProps> = ({ strategies }: StrategyTableProps) => {

  return (
    <table className="table">
      <thead>
        <tr className="border-1 border-solid border-dark-600 rounded-t-xl">
          <th className="pe-0"></th>
          <th>Vault</th>
          <th>APY</th>
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
              key={`strategy-group-${index}`}
              isLast={index === strategies.length - 1}
            />
          )
        })}
      </tbody>
    </table>
  );
};

export default StrategyTable;