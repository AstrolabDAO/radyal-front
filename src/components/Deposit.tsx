import { useContext, useEffect, useMemo, useState } from "react";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import { WalletContext } from "~/context/wallet-context";
import { StrategyContext } from "~/context/strategy-context";
import SelectToken from "./SelectToken";

const Deposit = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { balances } = useContext(WalletContext);

  const sortedTokens = useMemo(() => {
    return balances.sort((a, b) =>
      BigInt(a.amount) > BigInt(b.amount) ? -1 : 1
    );
  }, [balances]);

  const [selectedToken, setSelectedToken] = useState(sortedTokens?.[1] ?? null);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  useEffect(() => {
    if (!selectedToken) setSelectedToken(sortedTokens?.[1] ?? null);
  }, [sortedTokens, selectedToken]);

  return (
    <div className="deposit block">
      <div className="box w-full">
        {selectTokenMode && (
          <SelectToken
            tokens={sortedTokens}
            onSelect={(token) => {
              setSelectTokenMode(false);
              setSelectedToken(token);
            }}
          />
        )}
        {!selectTokenMode && (
          <>
            <CrossChainTokenSelect
              tokens={sortedTokens}
              activeSelectTokenMode={() => setSelectTokenMode(true)}
              selected={selectedToken}
              onSelect={(token) => setSelectedToken(token)}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default Deposit;
