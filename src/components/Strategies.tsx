import { useContext } from "react";
import { StrategyContext } from "~/context/strategy-context";
import StrategyBox from "./StrategyBox";
const Strategies = () => {
  const { strategies } = useContext(StrategyContext);
  return (
    <div className="strategies w-full small-container mx-auto">
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
        />
      </label>
      <ul className="flex items-center justify-center min-h-screen w-full flex-wrap">
        {strategies.map((strategy) => (
          <StrategyBox strategy={strategy} key={strategy.slug} />
        ))}
        ;
      </ul>
    </div>
  );
};
export default Strategies;
