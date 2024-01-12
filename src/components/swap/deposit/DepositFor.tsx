import { useContext } from "react";

import { Strategy } from "~/utils/interfaces";

import SwapBlock from "../helpers/SwapBlock";
import { EstimationContext } from "~/context/estimation-context";

const DepositFor = ({ strategy }: { strategy: Strategy }) => {
  const { toValue: depositToValue } = useContext(EstimationContext);
  const icons = {
    background: `/images/${strategy?.icon}`,
    foreground: strategy?.network?.icon,
  };

  return (
    <SwapBlock
      token={ strategy }
      disabled={ true }
      label="FOR"
      icons={ icons }
      onTokenClick={() => { } }
      symbol={ strategy?.symbol }
      network={ strategy?.network.name }
      value={ depositToValue }
      children={ <div className="text-xl font-bold mt-2 mb-1"> { depositToValue } </div> }
    />
  )
}

export default DepositFor;