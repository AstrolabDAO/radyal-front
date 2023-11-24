import { useContext } from "react";
import { StrategyContext } from "~/context/strategy-context";
import StrategyCard from "./StrategyBox";
const Strategies = () => {
  const { filteredStrategies, search } = useContext(StrategyContext);

  return (
    <div className="strategies w-full small-container mx-auto p-2">
      <h2 className="text-2xl text-center text-primary">
        Select your strategy...
      </h2>
      <label className="label block flex justify-end flex-wrap">
        <span className="label-text text-right block w-full mb-2">
          You need an specific strategy ?
        </span>
        <input
          type="text"
          placeholder="type anything..."
          className="input input-bordered w-full max-w-xs w-full"
          onChange={({ target }) => {
            search(target.value);
          }}
        />
      </label>
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
