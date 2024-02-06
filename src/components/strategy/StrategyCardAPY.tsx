import { toPercent } from "~/utils/format";

type StrategyCardAPYProps = {
  apy: number;
  hideLabel?: boolean;
};

const StrategyCardAPY = ({ apy, hideLabel }: StrategyCardAPYProps) => {
  return (
    <div className="flex flex-col w-1/2">
      {!hideLabel && (
        <div className="-mb-1 text-sm font-medium text-secondary-300">FOR</div>
      )}
      <div className="flex flex-row font-bold">
        <div className="text-3xl mt-auto font-black group-hover:text-primary">
          {toPercent(apy, 2, false, true)}
        </div>
        <div className="flex flex-col text-center">
          <span className="text-1xl strategy-card-data-unit">%</span>
          <span className="strategy-card-data-label group-hover:text-primary">
            APY
          </span>
        </div>
      </div>
    </div>
  );
};

export default StrategyCardAPY;
