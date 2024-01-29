import { Strategy } from "~/utils/interfaces";

type DepositIntoProps = {
  strategy: Strategy;
}

const DepositInto = ({ strategy }: DepositIntoProps) => {

  const { name } = strategy;
  const [title, subtitle]  = name.replace("Astrolab ", "").split(" ");

  const description = `Algorithmically provides liquidity across stable pools on ${title}.`
  return (
    <div className="flex flex-col md:basis-3/5 text-secondary-900">
      <div className="mb-1">INTO</div>
      <div className="flex flex-col m-0 p-3 border border-solid border-dark-700 rounded-3xl">
        <div className="font-bold italic text-3xl -mb-1 uppercase gilroy"> { title } </div>
        <div className="font-light text-xl gilroy"> { subtitle } </div>
        <div className="text-xs leading-3 text-gray font-extralight">
          { description }<br /><br />
          Claiming of reward tokens, rebalancing  and compounding is automated.
        </div>
      </div>
    </div>
  )
}

export default DepositInto;