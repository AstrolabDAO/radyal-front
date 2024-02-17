import clsx from "clsx";
import { toPercent } from "~/utils/format";

type StrategyCardAPYProps = {
  apy: string | number;
  hideLabel?: boolean;
};

const StrategyCardAPY = ({ apy, hideLabel }: StrategyCardAPYProps) => {
  return (
    <div className="flex flex-col text-white">
      {!hideLabel && <div className="-mb-1 text-sm font-medium text-grey">FOR</div>}
      <div className="flex flex-row font-bold">
        <div
          className={clsx(
            "text-3xl mt-auto font-extrabold group-hover:text-primary italic"
          )}
        >
          {toPercent(Number(apy) / 100, 2, false, true)}
        </div>
        <div className="flex flex-col text-center h-full">
          <span className="strategy-card-data-unit">%</span>
          <span className="font-bold strategy-card-data-label group-hover:text-primary">
            APY
          </span>
        </div>
      </div>
    </div>
  );
};

export default StrategyCardAPY;
