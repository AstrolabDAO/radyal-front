import DownwardIcon from "@/assets/icons/downward.svg?react";
import UpwardIcon from "@/assets/icons/upward.svg?react";
import React, { useContext, useMemo, useState } from "react";
import { useGrouppedStrategies } from "~/hooks/strategies";
import StrategyTableRow from "./StrategyTableRow";
import { StrategyTableContext } from "~/context/strategy-table.context";

const StrategyTable = () => {
  const { filteredStrategiesGroups: groups } = useContext(StrategyTableContext);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null); // 'asc', 'desc', or null
  const { isFolio, holdings, weightedAPYs } = useContext(StrategyTableContext);

  const sortedStrategyGroups = useMemo(() => {
    if (!sortColumn || !sortDirection) return groups;

    return [...groups].sort((a, b) => {
      const valueA = a[0][sortColumn];
      const valueB = b[0][sortColumn];

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [groups, sortColumn, sortDirection]);

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <UpwardIcon className="h-3 w-3 mx-2 fill-primary" />
    ) : (
      <DownwardIcon className="h-3 w-3 mx-2 fill-primary" />
    );
  };

  return (
    <table className="table rounded-xl">
      <thead className="text-secondary">
        <tr>
          {[
            "Vault",
            "APY",
            isFolio ? "HOLDINGS" : "TVL",
            "Asset",
            "Protocols",
            "Chains",
            "7d",
          ].map((header, index) => (
            <th
              key={index}
              onClick={() => handleSort(header.toLowerCase())}
              className={`cursor-pointer ${sortColumn === header.toLowerCase() ? "font-bold text-primary" : ""}`}
            >
              <span className="flex">
                {header} {renderSortIcon(header.toLowerCase())}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedStrategyGroups.map((group, index) => (
          <StrategyTableRow
            holding={holdings[index]}
            apy={weightedAPYs[index]}
            strategyGroup={group}
            key={`strategy-table-list-${index}`}
            isLast={index === sortedStrategyGroups.length - 1}
          />
        ))}
      </tbody>
    </table>
  );
};

export default StrategyTable;
