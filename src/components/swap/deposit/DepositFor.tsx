import { useContext, useMemo } from "react";

import { Strategy } from "~/utils/interfaces";

import SwapBlock from "../helpers/SwapBlock";
import { EstimationContext } from "~/context/estimation-context";

const DepositFor = ({ strategy }: { strategy: Strategy  & { protocols: [] }}) => {
  const { toValue: depositToValue } = useContext(EstimationContext);

  const networkName = useMemo(() => {
    if (strategy?.network.name === 'Gnosis Chain-Mainnet') return 'Gnosis';
    return strategy?.network.name;
  }, [strategy]);

  const icons = {
    background: strategy?.icon,
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
      network={ networkName }
      value={ depositToValue }
      children={ <div className="text-xl font-bold my-auto py-2"> { depositToValue } </div> }
    />
  )
}

export default DepositFor;