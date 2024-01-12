import { Strategy } from "~/utils/interfaces";

type DepositIntoProps = {
  strategy: Strategy;
}

const DepositInto = ({ strategy }: DepositIntoProps) => {

  const { name } = strategy;
  const [title, subtitle]  = name.replace("Astrolab ", "").split(" ");

  const description = `Algorithmically provides liquidity across stable pools on ${title}.`
  return (
    <div className="flex flex-col md:basis-3/5">
      <div className="mb-1">INTO</div>
      <div className="flex flex-col m-0 p-3 border border-solid border-gray-500 rounded-3xl gilroy">
        <div className="font-bold italic text-3xl -mb-1 uppercase"> { title } </div>
        <div className="font-light text-xl"> { subtitle } </div>
        <div className="text-2xs">
          { description }<br />
          Claiming of reward tokens, rebalancing  and compounding is automated.
        </div>
      </div>
    </div>
  )
}

export default DepositInto;