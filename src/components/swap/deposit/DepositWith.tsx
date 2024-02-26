import { useEffect, useMemo, useState } from "react";

import { useFromValue } from "~/hooks/swapper";
import { setFromValue } from "~/services/swapper";
import { Token } from "~/utils/interfaces";
import ActionBlock from "../helpers/ActionBlock";
import { SwapInput } from "~/components/styled";
type DepositWithProps = {
  token: Token;
  onTokenClick: () => void;
};

const DepositWith = ({ token, onTokenClick }: DepositWithProps) => {
  const [depositValue, setDepositValue] = useState<string>("");

  const fromValue = useFromValue();

  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const replace = event.target.value
      .replace(/[^0-9.,]/g, "")
      .replace(",", ".")
      .replace(/^[.]$/, "0.");

    setDepositValue(replace);
    setFromValue(Number(replace));
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
    <ActionBlock
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
      <div className="flex">
        <SwapInput
          placeholder="10.0"
          value={depositValue ?? ""}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </ActionBlock>
  );
};

export default DepositWith;
