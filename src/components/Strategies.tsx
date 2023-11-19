import { useContext } from "react";
import { StrategyContext } from "~/context/strategy-context";
import StrategyBox from "./StrategyBox";
const Strategies = () => {
  const { strategies } = useContext(StrategyContext);
  return (
    <div className="strategies w-full small-container mx-auto">
      <h2 className="">Select your strategy</h2>
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
