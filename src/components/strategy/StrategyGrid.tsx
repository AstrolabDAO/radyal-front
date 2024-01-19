import { useContext, useMemo } from "react";
import { StrategyContext } from "~/context/strategy-context";
import StrategyCard from "./StrategyCard";
import NetworkSelect, { NetworkSelectData } from "../NetworkSelect";
import { useSelector } from "react-redux";
import { useSelectOperation } from "~/hooks/operation";
import { operationsSelector } from "~/store/selectors/operations";
import { SwapModalContext } from "~/context/swap-modal-context";
import SwapStepsModal from "../modals/SwapStepsModal";
import { OperationStatus } from "~/model/operation";

const StrategyGrid = () => {
  const { filteredStrategies, search, filterByNetworks, strategies } =
    useContext(StrategyContext);

  const grouppedStrategies = useMemo(
    () => Object.values(filteredStrategies),
    [filteredStrategies]
  );
  const operations = useSelector(operationsSelector);

  const selectOperation = useSelectOperation();
  const { openModal } = useContext(SwapModalContext);
  return (
    <div className="w-full container px-2 sm:mx-auto">
      <div className="flex flex-col md:flex-row w-full">
        <div className="mr-4 w-full flex flex-col">
          <span className="label-text block my-2">Search</span>
          <input
            type="text"
            placeholder="“Stable”, “Arbitrum”, “Staking”..."
            className="input input-bordered"
            onChange={({ target }) => {
              search(target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="label-text my-2">filter by network...</span>
          <NetworkSelect
            isSearchable
            className="basic-multi-select w-64 h-12"
            classNamePrefix="select"
            networks={strategies.map(({ network }) => network)}
            onChange={(value: Array<NetworkSelectData>) => {
              filterByNetworks(value.map((v) => v.network?.slug));
            }}
          />
        </div>
      </div>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-5">
        {grouppedStrategies.length === 0 && (
          <div className="flex w-full justify-center">No strategies...</div>
        )}
        {grouppedStrategies.map((strategyGroup, index) => (
          <StrategyCard
            strategyGroup={strategyGroup}
            key={`strategy-group-${index}`}
          />
        ))}
      </div>
      <ul className="transactionList">
        {operations
          .filter(({ status }) => status === OperationStatus.PENDING)
          .map((operation) => (
            <li key={operation.id}>
              <button
                onClick={() => {
                  selectOperation(operation.id);
                  openModal(<SwapStepsModal />);
                }}
              >
                {operation.id}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StrategyGrid;
