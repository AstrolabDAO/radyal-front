import { useEffect, useState } from "react";

import { useFromValue, useSetFromValue } from "~/hooks/store/swapper";

import { getIconFromStrategy } from "~/utils";
import { Strategy } from "~/utils/interfaces";

import SwapBlock from "../helpers/SwapBlock";


type WWithProps = {
  strategy: Strategy;
};

const WithdrawWith = ({ strategy }: WWithProps) => {
  const [depositValue, setDepositValue] = useState<string | number>("");
  const setFromValue = useSetFromValue();
  const fromValue = useFromValue();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const replace = event.target.value
      .replace(/[^0-9.,]/g, "")
      .replace(",", ".")
      .replace(/^[.]$/, "0.");

    setDepositValue(replace);
    setFromValue(Number(event.target.value));
  };

  const icons = {
    background: getIconFromStrategy(strategy),
    foreground: strategy?.network.icon
  }
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (fromValue) setDepositValue(fromValue.toString());
  }, [fromValue]);
  // TODO: add a guidance when no token is selected
  return (
    <SwapBlock
      token={ strategy }
      isFocused={ isFocused }
      label="WITH"
      icons={icons}
      symbol={strategy?.symbol}
      network={strategy?.network.name}
      value={fromValue}
      onTokenClick={() => {}}
      children={
        <div className="flex ms-auto">
          <input
            className="swap-input-field"
            type="number"
            min="0"
            placeholder="10.0"
            value={ depositValue?.toString() ?? "" }
            onChange={ handleInputChange }
            onFocus={ () => setIsFocused(true) }
            onBlur={ () => setIsFocused(false) }
          />
        </div>
      }
    />
  );
};

export default WithdrawWith;
