import { useContext, useMemo } from "react";
import { StrategyContext } from "~/context/strategy-context";
import StrategyCard from "./StrategyCard";
import NetworkSelect, { NetworkSelectData } from "../NetworkSelect";

const StrategyList = () => {
  const { filteredStrategies, search, filterByNetworks, strategies } =
    useContext(StrategyContext);

  const grouppedStrategies = useMemo(
    () => Object.values(filteredStrategies),
    [filteredStrategies]
  );

  return (
    <div className="w-full container px-2 md:mx-auto">
      <h2 className="text-2xl text-center text-primary mb-8">
        Select your strategy...
      </h2>
      <div className="flex flex-col md:flex-row w-full justify-end">
        <div className="mr-4">
          <span className="label-text block w-full mb-2">search anything</span>
          <input
            type="text"
            placeholder="type anything..."
            className="input input-bordered max-w-xs w-64"
            onChange={({ target }) => {
              search(target.value);
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
    </div>
  );
};

export default StrategyList;
