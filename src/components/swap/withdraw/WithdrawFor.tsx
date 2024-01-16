import { useContext } from "react";

import { Token } from "~/utils/interfaces";
import { SwapContext } from "~/context/swap-context";

import SwapBlock from "../helpers/SwapBlock";

type WForProps = {
  token: Token;
  onTokenClick: () => void;
}

const WithdrawFor = ({ token, onTokenClick }: WForProps) => {
  const { toValue: depositToValue } = useContext(SwapContext);
  const icons = {
    background: `/images/${token?.icon}`,
    foreground: token?.network?.icon,
  };

  return (
    <SwapBlock
      token={ token }
      disabled={ false }
      label="FOR"
      icons={ icons }
      onTokenClick={ onTokenClick }
      symbol={ token?.symbol }
      network={ token?.network.name }
      value={ depositToValue }
      children={ <div className="text-xl font-bold mt-2 mb-1"> { depositToValue } </div> }
    />
  )
}

export default WithdrawFor;