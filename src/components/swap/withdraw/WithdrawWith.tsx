import { useEffect, useState } from "react";

import { useFromValue, useSetFromValue } from "~/hooks/store/swapper";
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
    foreground: strategy?.icon,
    background: strategy?.network.icon,
  };

  useEffect(() => {
    if (fromValue) setDepositValue(fromValue.toString());
  }, [fromValue]);
  // TODO: add a guidance when no token is selected
  return (
    <SwapBlock
      token={strategy}
      disabled={true}
      label="WITH"
      icons={icons}
      symbol={strategy?.symbol}
      network={strategy?.network.name}
      value={fromValue}
      onTokenClick={() => {}}
      children={
        <div className="flex ms-auto">
          <input
            className="input py-1 my-2 font-bold text-xl text-right ms-auto w-full basis-4/5"
            type="number"
            value={depositValue?.toString() ?? ""}
            onChange={handleInputChange}
          />
        </div>
      }
    />
  );
};

export default WithdrawWith;
