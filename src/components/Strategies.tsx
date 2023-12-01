import { useContext } from "react";
import { StrategyContext } from "~/context/strategy-context";
import StrategyCard from "./StrategyBox";
import NetworkSelect, { NetworkSelectData } from "./NetworkSelect";
const Strategies = () => {
  const { filteredStrategies, search, filterByNetworks, strategies } =
    useContext(StrategyContext);

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
            className="input input-bordered w-full max-w-xs w-full w-64"
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
            className="basic-multi-select w-full w-64 h-12"
            classNamePrefix="select"
            networks={strategies.map(({ network }) => network)}
            onChange={(value: Array<NetworkSelectData>) => {
              filterByNetworks(value.map((v) => v.network?.slug));
            }}
          />
        </div>
      </div>
      <ul className="flex w-full flex-wrap">
        {filteredStrategies.length === 0 && (
          <div className="flex w-full justify-center">No strategies...</div>
        )}
        {filteredStrategies.map((strategy) => (
          <StrategyCard strategy={strategy} key={strategy.slug} />
        ))}
      </ul>
    </div>
  );
};

export default Strategies;
