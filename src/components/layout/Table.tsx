import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const sortOrders = ['none', 'desc', 'asc']; // Define sort orders

const Table = ({ headers = [], data = [] }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortState, setSortState] = useState(headers.map(() => 'none'));

  const sortData = (index) => {
    const nextSortOrder = sortOrders[(sortOrders.indexOf(sortState[index]) + 1) % sortOrders.length];
    const newSortState = [...sortState];
    newSortState[index] = nextSortOrder;
    setSortState(newSortState);

    if (nextSortOrder === 'none') {
      setSortedData(data);
    } else {
      const sorted = [...data].sort((a, b) => {
        if (a[index] < b[index]) return nextSortOrder === 'asc' ? -1 : 1;
        if (a[index] > b[index]) return nextSortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      setSortedData(sorted);
    }
  };

  useEffect(() => {
    setSortedData(data); // Reset sorted data when original data changes
  }, [data]);

  return (
    <table className="table rounded-xl">
      <thead className="text-secondary">
        <tr>
          <th className="pe-0"></th>
          {headers.map((header, index) => (
            <th
              key={`strategy-table-header-${index}`}
              onClick={() => sortData(index)}
              style={{ cursor: 'pointer' }}
            >
              {header}
              {sortState[index] !== 'none' && (sortState[index] === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((group, groupIndex) => (
          <tr
            key={`row-${groupIndex}`}
            className={clsx(
              "border-t-1 border-solid border-darkGrey",
              groupIndex === data.length - 1 && "rounded-b-xl"
            )}
          >
            {group.map((cell, cellIndex) => (
              <td key={`strategy-table-cell-${groupIndex}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
