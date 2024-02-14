import { toDollarsAuto, toDollarsCompact } from "~/utils/format";

type StrategyCardTVLProps = {
  tvl: number;
};

const StrategyCardTVL = ({ tvl }: StrategyCardTVLProps) => {
  return (
    <div className="flex flex-col ms-auto pe-2">
      <div className="-mb-1 text-sm font-medium">WITH</div>
      <div className="flex flex-row font-extralight">
        <div className="text-3xl">{toDollarsCompact(tvl)}</div>
        <div className="flex flex-col text-center font-medium justify-end pb-1">
          <span className="strategy-card-data-label">TVL</span>
        </div>
      </div>
    </div>
  );
};

export default StrategyCardTVL;
