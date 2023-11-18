import { Strategy } from "~/utils/interfaces";
import IconGroup from "./IconGroup";

interface StrategyProps {
  strategy: Strategy;
}
const StrategyBox = ({ strategy }: StrategyProps) => {
  const { name } = strategy;
  const { nativeNetwork, token } = strategy;
  console.log(
    "🚀 ~ file: StrategyBox.tsx:6 ~ StrategyBox ~ nativeNetwork:",
    nativeNetwork
  );

  const icons = [
    { url: nativeNetwork.icon, alt: nativeNetwork.name },
    { url: token.icon, alt: token.symbol },
  ];
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <IconGroup icons={icons} />
          {name}
        </h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};
export default StrategyBox;
