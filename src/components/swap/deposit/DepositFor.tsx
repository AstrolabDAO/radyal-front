import { Strategy } from "~/utils/interfaces";
import DepositSwapBlock from "../helpers/DepositSwapBlock";

const DepositFor = ({ strategy }: { strategy: Strategy }) => {
  const number = 123;
  const icons = {
    background: `/images/${strategy.share.icon}`,
    foreground: strategy.share.network.icon,
  };


  return (
    <DepositSwapBlock
      disabled={true}
      label="FOR"
      icons={icons}
      onTokenClick={() => { } }
      symbol={strategy?.share?.symbol}
      network={strategy?.share?.network.name}
      children={<div className="text-xl font-bold mt-2 mb-1"> { number } </div>}
    />
  )
}

export default DepositFor;