import { useContext } from "react";
import { Web3Context } from "~/context/web3-context";
import { getIconFromStrategy } from "~/utils";
import { Strategy } from "~/utils/interfaces";

type DepositIntoProps = {
  strategy: Strategy;
}

const DepositInto = ({ strategy }: DepositIntoProps) => {

  const { name } = strategy;
  const [title, subtitle]  = name.replace("Astrolab ", "").split(" ");
  const protocols = useContext(Web3Context).protocols;
  const description = `Algorithmically provides liquidity across stable pools on ${title}.`
  const strategyIconPath = (getIconFromStrategy(strategy, protocols).replace('.svg', '-mono.svg'));
  return (
    <div className="flex flex-col md:basis-3/5 text-secondary-900">
      <div className="mb-1">INTO</div>
      <div className="flex flex-col m-0 p-3 border border-solid border-dark-500 rounded-3xl relative overflow-hidden">
        <div
          className="absolute inset-0 flex justify-end items-center z-0 overflow-hidden contrast-63 -mr-16"
        >
          <img
            src={ strategyIconPath }
            className="h-52 w-52 strategy-icon-filter"
          />
        </div>
        <div className="relative z-10">
          <div className="font-bold italic text-3xl -mb-1 uppercase gilroy"> { title } </div>
          <div className="font-light text-xl gilroy"> { subtitle } </div>
          <div className="text-xs leading-3 text-gray font-extralight">
            { description }<br /><br />
            Claiming of reward tokens, rebalancing  and compounding is automated.
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepositInto;