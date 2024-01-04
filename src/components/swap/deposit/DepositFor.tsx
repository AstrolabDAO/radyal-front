import { Strategy } from "~/utils/interfaces";
import DepositSwapBlock from "../helpers/DepositSwapBlock";

const DepositFor = ({ strategy }: { strategy: Strategy }) => {
  const number = 123;
  const icons = {
    background: `/images/${strategy.icon}`,
    foreground: strategy.network.icon,
  };


  return (
    <DepositSwapBlock
      disabled={true}
      label="FOR"
      icons={icons}
      onTokenClick={() => { } }
      symbol={strategy?.symbol}
      network={strategy?.network.name}
      children={<div className="text-xl font-bold mt-2 mb-1"> { number } </div>}
    />
  )
}

export default DepositFor;