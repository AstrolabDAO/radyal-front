type StrategyCardTVLProps = {
  tvl: number
}

const StrategyCardTVL = ({ tvl }: StrategyCardTVLProps) => {
  return (
    <div className="flex flex-col mx-auto">
      <div className="-mb-1 text-sm text-gray-500 font-light">
        WITH
      </div>
      <div className="flex flex-row font-extralight">
        <div className="text-3xl"> {tvl} </div>
        <div className="flex flex-col text-center font-medium">
          <span className="text-1xl strategy-card-data-unit">
            M
          </span>
          <span className="text-2xs strategy-card-data-label">
            TVL
          </span>
        </div>
      </div>
    </div>
  )
}

export default StrategyCardTVL;
