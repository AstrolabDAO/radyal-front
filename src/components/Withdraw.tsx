import { useContext, useEffect } from "react";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { TokensContext } from "~/context/tokens-context";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import SelectToken from "./SelectToken";
const Withdraw = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const {
    selectTokenMode,
    selectToToken,
    switchSelectMode,
    selectFromToken,
    fromToken,
    toToken,
  } = useContext(SwapContext);

  useEffect(() => {
    selectFromToken(selectedStrategy.token);
  }, [selectedStrategy, selectFromToken]);

  const { tokens } = useContext(TokensContext);

  if (selectTokenMode) {
    return (
      <div className="select-token block">
        <div className="box w-full">
          <SelectToken
            tokens={tokens}
            onSelect={(token) => {
              switchSelectMode();
              selectToToken(token);
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="withdraw block">
      <div className="box w-full">
        <CrossChainTokenSelect
          locked={true}
          selected={selectedStrategy.token}
        />
        <hr />
        <CrossChainTokenSelect selected={toToken} isReceive={true} />
      </div>
      <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse">
        <div className="flex w-full justify-center">
          <button className="btn btn-primary w-full">Withdraw</button>
        </div>
      </div>
    </div>
  );
};
export default Withdraw;
