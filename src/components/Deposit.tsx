import { useContext, useEffect, useMemo, useState } from "react";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import { WalletContext } from "~/context/wallet-context";
import { StrategyContext } from "~/context/strategy-context";

const Deposit = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { balances } = useContext(WalletContext);

  const sortedTokens = useMemo(() => {
    return balances.sort((a, b) =>
      BigInt(a.amount) > BigInt(b.amount) ? -1 : 1
    );
  }, [balances]);

  const [selectedToken, setSelectedToken] = useState(sortedTokens?.[0] ?? null);

  useEffect(() => {
    if (!selectedToken) setSelectedToken(sortedTokens?.[0] ?? null);
  }, [sortedTokens, selectedToken]);

  return (
    <div className="deposit block">
      <div className="box w-full">
        <CrossChainTokenSelect
          tokens={sortedTokens}
          selected={selectedToken}
          onSelect={(token) => setSelectedToken(token)}
        />
      </div>
    </div>
  );
};
export default Deposit;
