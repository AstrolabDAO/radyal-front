import React, { useState, useMemo } from 'react';
import { Strategy } from '~/utils/interfaces';
import StrategyTableListItem from './StrategyTableListItem';
import UpwardIcon from '@/assets/icons/upward.svg?react';
import DownwardIcon from '@/assets/icons/downward.svg?react';

type StrategyTableProps = {
  strategies: Strategy[][];
};

const StrategyTable: React.FC<StrategyTableProps> = ({ strategies }: StrategyTableProps) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null); // 'asc', 'desc', or null

  const sortedStrategies = useMemo(() => {
    if (!sortColumn || !sortDirection) return strategies;

    return [...strategies].sort((a, b) => {
      const valueA = a[0][sortColumn];
      const valueB = b[0][sortColumn];

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [strategies, sortColumn, sortDirection]);

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <UpwardIcon className="h-3 w-3 mx-2 fill-primary"/> : <DownwardIcon className="h-3 w-3 mx-2 fill-primary"/>;
  };

  return (
    <table className="table rounded-xl">
      <thead className="text-secondary">
        <tr>
          <th className="pe-0"></th>
          {["Vault", "APY", "TVL", "Protocols", "Chains", "7d"].map((header, index) => (
            <th
              key={index}
              onClick={() => handleSort(header.toLowerCase())}
              className={`cursor-pointer ${sortColumn === header.toLowerCase() ? 'font-bold text-primary' : ''}`}
            >
              <span className="flex items-center">{header} {renderSortIcon(header.toLowerCase())}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedStrategies.map((group, index) => (
          <StrategyTableListItem
            strategyGroup={group}
            key={`strategy-table-list-${index}`}
            isLast={index === sortedStrategies.length - 1}
          />
        ))}
      </tbody>
    </table>
  );
};

export default StrategyTable;
