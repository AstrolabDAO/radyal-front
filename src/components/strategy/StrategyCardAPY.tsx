type StrategyCardAPYProps = {
  apy: number
  hideLabel?: boolean
}

const StrategyCardAPY = ({ apy, hideLabel }: StrategyCardAPYProps) => {
  return (
    <div className="flex flex-col w-1/2">
      { !hideLabel && (
      <div className="-mb-1 text-sm text-gray-500">
        FOR
      </div>
      )}
      <div className="flex flex-row font-bold">
        <div className="text-3xl mt-auto"> {apy} </div>
        <div className="flex flex-col text-center">
          <span className="text-1xl strategy-card-data-unit">
            %
          </span>
          <span className="text-2xs strategy-card-data-label">
            APY
          </span>
        </div>
      </div>
    </div>
  )
}

export default StrategyCardAPY;
