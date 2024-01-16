import { useContext, useEffect, useState } from "react";

import { Token } from "~/utils/interfaces";
import SwapBlock from "../helpers/SwapBlock";
import { SwapContext } from "~/context/swap-context";


type DepositWithProps = {
  token: Token;
  onTokenClick: () => void;
}

const DepositWith = ({ token, onTokenClick } : DepositWithProps) => {

  const [depositValue, setDepositValue] = useState<string | number>('');
  const { fromValue ,setFromValue } = useContext(SwapContext);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const replace = event.target.value
      .replace(/[^0-9.,]/g, "")
      .replace(",", ".")
      .replace(/^[.]$/, "0.");

    setDepositValue(replace);
    setFromValue(Number(event.target.value));
  };

  const setWholeWallet = (walletBalance: number) => {
    setDepositValue(walletBalance);
    setFromValue(walletBalance);
  }

  const icons = {
    foreground: token?.icon,
    background: token?.network.icon
  }
  useEffect(() => {
    setDepositValue(fromValue);
  }, [fromValue]);

  // TODO: add a guidance when no token is selected
  return (
    <SwapBlock
      token={ token }
      disabled={ false }
      label="WITH"
      icons={ icons }
      symbol={ token?.symbol }
      network={ token?.network.name }
      value={ depositValue as number }
      onTokenClick={ onTokenClick }
      onWalletClick={ setWholeWallet }
      children={
        <div className="flex ms-auto">
          <input
            className="input input-ghost max-h-9 py-1 my-2 font-bold text-xl text-right ms-auto w-full basis-4/5"
            type="number"
            placeholder="10.0"
            value={ depositValue?.toString() ?? "" }
            onChange={ handleInputChange }
          />
        </div>
      }
    />
  )
}

export default DepositWith;