type StrategyCardTVLProps = {
  tvl: number
}

const StrategyCardTVL = ({ tvl }: StrategyCardTVLProps) => {
  return (
    <div className="flex flex-col w-1/2">
      <div className="-mb-1 text-sm text-gray-500 font-light">
        WITH
      </div>
      <div className="flex flex-row font-extralight">
        <div className="text-3xl"> {tvl} </div>
        <div className="flex flex-col text-center font-medium">
          <span className="text-1xl">
            M
          </span>
          <span className="text-xs -mt-2">
            TVL
          </span>
        </div>
      </div>
    </div>
  )
}

export default StrategyCardTVL;
