import { useEffect, useState } from "react";

import { useFromValue } from "~/hooks/swapper";

import { getIconFromStrategy } from "~/utils";
import { Strategy } from "~/utils/interfaces";

import ActionBlock from "../helpers/ActionBlock";
import { setFromValue } from "~/services/swapper";
import { Input } from "~/components/styled";

type WWithProps = {
  strategy: Strategy;
};

const WithdrawWith = ({ strategy }: WWithProps) => {
  const [depositValue, setDepositValue] = useState<string | number>("");

  const fromValue = useFromValue();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const replace = event.target.value
      .replace(/[^0-9.,]/g, "")
      .replace(",", ".")
      .replace(/^[.]$/, "0.");

    setDepositValue(replace);
    setFromValue(Number(replace));
  };

  const icons = {
    background: getIconFromStrategy(strategy),
    foreground: strategy?.network.icon,
  };
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (fromValue) setDepositValue(fromValue.toString());
  }, [fromValue]);
  // TODO: add a guidance when no token is selected
  return (
    <ActionBlock
      token={strategy}
      isFocused={isFocused}
      label="WITH"
      disabled={true}
      icons={icons}
      symbol={strategy?.symbol}
      network={strategy?.network.name}
      value={fromValue}
      onTokenClick={() => {}}
      children={
        <div className="flex ms-auto">
          <Input
            className="swap-input-field"
            placeholder="10.0"
            value={depositValue?.toString() ?? ""}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      }
    />
  );
};

export default WithdrawWith;
