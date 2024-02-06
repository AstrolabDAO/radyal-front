import { useEffect, useMemo, useState } from "react";

import { useFromValue, useSetFromValue } from "~/hooks/store/swapper";
import { Token } from "~/utils/interfaces";
import SwapBlock from "../helpers/SwapBlock";

type DepositWithProps = {
  token: Token;
  onTokenClick: () => void;
};

const DepositWith = ({ token, onTokenClick }: DepositWithProps) => {
  const [depositValue, setDepositValue] = useState<string>("");

  const fromValue = useFromValue();
  const setFromValue = useSetFromValue();
  const [isFocused, setIsFocused] = useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const replace = event.target.value
      .replace(/[^0-9.,]/g, "")
      .replace(",", ".")
      .replace(/^[.]$/, "0.");

    setDepositValue(replace);
    setFromValue(Number(event.target.value));
  };

  const setWholeWallet = (walletBalance: number) => {
    setDepositValue(walletBalance.toString());
    setFromValue(walletBalance);
  };

  const icons = {
    foreground: token?.network.icon,
    background: token?.icon,
  };

  const networkName = useMemo(() => {
    if (token?.network.name === "Gnosis Chain-Mainnet") return "Gnosis";
    return token?.network.name;
  }, [token]);

  useEffect(() => {
    if (fromValue) setDepositValue(fromValue.toString());
  }, [fromValue]);

  // TODO: add a guidance when no token is selected

  return (
    <SwapBlock
      token={token}
      isFocused={isFocused}
      disabled={false}
      label="WITH"
      icons={icons}
      symbol={token?.symbol}
      network={networkName}
      value={fromValue}
      onTokenClick={onTokenClick}
      onWalletClick={setWholeWallet}
    >
      <div className="flex ms-auto">
        <input
          className="focus:outline-none bg-dark-700 placeholder:text-dark-500 my-1 max-h-9 pe-0 font-medium text-2xl text-right ms-auto w-full basis-4/5 rounded-none text-secondary"
          type="number"
          min="0"
          placeholder="10.0"
          value={depositValue ?? ""}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </SwapBlock>
  );
};

export default DepositWith;
