import clsx from "clsx";

const Table = ({ headers = [], data = [] }) => {
  return (
    <table className="table border-dark-600 rounded-xl">
      <thead>
        <tr>
          <th className="pe-0"></th>
          {headers.map((header, index) => {
            return <th key={`strategy-table-header-${index}`}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((group, index) => {
          return (
            <tr
              className={clsx(
                "border-t-1 border-solid border-dark-600",
                index === data.length - 1 && "rounded-b-xl"
              )}
            >
              {group.map((cell, index) => {
                return <td key={`strategy-table-cell-${index}`}>{cell}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default Table;
