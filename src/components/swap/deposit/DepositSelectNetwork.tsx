import { useContext } from 'react';
import { StrategyContext } from '~/context/strategy-context';
import { Strategy } from '~/utils/interfaces';

const DepositSelectNetwork = () => {
  const { selectedGroup, selectStrategy } = useContext(StrategyContext);
  const strategies: Array<Strategy & { apy: string, tvl: string }> = selectedGroup
    .map(strategy => ({
      ...strategy,
      apy: '25',
      tvl: '22.3'
    }));
  return (
    <div className="flex flex-col md:basis-2/5 ps-3 my-auto">
      <div className='flex flex-row text-center'>
        <div className='basis-1/3 text-start'>CHAIN</div>
        <div className='basis-1/3'>APY</div>
        <div className='basis-1/3'>TVL</div>
      </div>
      {strategies.map((strategy, index) => {
        return (
          <div key={`${strategy.network.id}-${index}`}
            className='hover:bg-gray-200 rounded-xl my-1 cursor-pointer'
            onClick={ () => selectStrategy(strategy) }
          >
            <div className='flex flex-row items-center my-1 text-center'>
              <div className='basis-1/3'>
                <img
                  className='h-6 w-6 ms-2'
                  src={ strategy.network.icon }
                  alt={strategy.network.slug}
                />
              </div>
              <div className='basis-1/3 font-bold'>{ strategy.apy }%</div>
              <div className='basis-1/3 font-light'>{ strategy.tvl }%</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DepositSelectNetwork;