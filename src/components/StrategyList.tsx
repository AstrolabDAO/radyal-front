import { useDispatch } from "react-redux";
import {
  useGrouppedStrategies,
  useStrategiesNetworks,
} from "~/hooks/store/strategies";
import NetworkSelect, { NetworkSelectData } from "./NetworkSelect";
import StrategyCard from "./StrategyCard";
import { filterByNetworks, search } from "~/store/strategies";

const StrategyList = () => {
  const grouppedStrategies = useGrouppedStrategies();
  const strategyNetworks = useStrategiesNetworks();
  const dispatch = useDispatch();

  return (
    <div className="strategies w-full small-container mx-auto p-2">
      <h2 className="text-2xl text-center text-primary mb-8">
        Select your strategy...
      </h2>

      <div className="flex w-full justify-end">
        <div className="mr-4">
          <span className="label-text block w-full mb-2">search anything</span>
          <input
            type="text"
            placeholder="type anything..."
            className="input input-bordered max-w-xs w-64"
            onChange={({ target }) => {
              dispatch(search(target.value));
            }}
          />
        </div>
        <div>
          <span className="label-text block w-full mb-2">
            filter by network...
          </span>
          <NetworkSelect
            isSearchable
            className="basic-multi-select w-64 h-12"
            classNamePrefix="select"
            networks={strategyNetworks}
            onChange={(value: Array<NetworkSelectData>) => {
              dispatch(filterByNetworks(value.map((v) => v.network?.slug)));
            }}
          />
        </div>
      </div>
      <ul className="flex w-full flex-wrap gap-4 mt-12">
        {grouppedStrategies.length === 0 && (
          <div className="flex w-full justify-center">No strategies...</div>
        )}
        {grouppedStrategies.map((strategyGroup, index) => (
          <StrategyCard
            strategyGroup={strategyGroup}
            key={`strategy-group-${index}`}
          />
        ))}
      </ul>
    </div>
  );
};

export default StrategyList;
