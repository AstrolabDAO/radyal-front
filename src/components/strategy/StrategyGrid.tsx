import { useDispatch, useSelector, useStore } from "react-redux";
import { useOpenModal } from "~/hooks/store/modal";
import { useSelectOperation } from "~/hooks/store/operation";
import {
  useGrouppedStrategies,
  useStrategiesNetworks,
} from "~/hooks/store/strategies";
import { operationsSelector } from "~/store/selectors/operations";
import { filterByNetworks, search } from "~/store/strategies";
import NetworkSelect, { NetworkSelectData } from "../NetworkSelect";
import SwapStepsModal from "../modals/SwapStepsModal";
import StrategyCard from "./StrategyCard";

const StrategyGrid = () => {
  const grouppedStrategies = useGrouppedStrategies();
  const operations = useSelector(operationsSelector);
  const dispatch = useDispatch();
  const selectOperation = useSelectOperation();
  const strategiesNetworks = useStrategiesNetworks();
  const openModal = useOpenModal();

  return (
    <div className="w-full container px-2 sm:mx-auto mt-5">
      <div className="flex flex-col md:flex-row w-full">
        <div className="mr-4 w-full flex flex-col">
          <span className="label-text block my-2">Search</span>
          <input
            type="text"
            placeholder="“Stable”, “Arbitrum”, “Staking”..."
            className="input input-bordered bg-dark-800"
            onChange={({ target }) => {
              dispatch(search(target.value));
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="label-text my-2">Chain</span>
          <NetworkSelect
            isSearchable={false}
            className="w-64 h-12"
            networks={strategiesNetworks}
            onChange={(value: Array<NetworkSelectData>) => {
              dispatch(filterByNetworks(value.map((v) => v.network?.slug)));
            }}
          />
        </div>
      </div>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5 max-w-screen">
        {grouppedStrategies.length === 0 && (
          <>
            <div className="card shimmer h-36" />
            <div className="card shimmer h-36" />
            <div className="card shimmer h-36" />
            <div className="card shimmer h-36" />
            <div className="card shimmer h-36" />
            <div className="card shimmer h-36" />
          </>
        )}
        {grouppedStrategies.map((strategyGroup, index) => (
          <StrategyCard
            strategyGroup={strategyGroup}
            key={`strategy-group-${index}`}
          />
        ))}
      </div>
      <ul className="transactionList">
        {operations.map((operation) => (
          <li key={operation.id}>
            <button
              onClick={() => {
                selectOperation(operation.id);
                openModal(<SwapStepsModal />);
              }}
            >
              {operation.id} {"=>"} {operation.status} {" => "}{" "}
              {operation.substatus}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StrategyGrid;
