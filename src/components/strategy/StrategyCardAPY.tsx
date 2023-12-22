type StrategyCardAPYProps = {
  apy: number
}

const StrategyCardAPY = ({ apy }: StrategyCardAPYProps) => {
  return (
    <div className="flex flex-col w-1/2">
      <div className="-mb-1 text-sm text-gray-500">
        FOR
      </div>
      <div className="flex flex-row font-bold">
        <div className="text-3xl"> {apy} </div>
        <div className="flex flex-col">
          <span className="text-1xl">
            %
          </span>
          <span className="text-xs -mt-2">
            APY
          </span>
        </div>
      </div>
    </div>
  )
}

export default StrategyCardAPY;
