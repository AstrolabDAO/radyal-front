import { useContext, useEffect } from "react";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { TokensContext } from "~/context/tokens-context";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import SelectToken from "./SelectToken";
import ModalLayout from "./layout/ModalLayout";
const Withdraw = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const {
    selectTokenMode,
    selectToToken,
    switchSelectMode,
    selectFromToken,
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
    <ModalLayout actions={[{ label: "Withdraw", onClick: () => {} }]}>
      <CrossChainTokenSelect locked={true} selected={selectedStrategy.token} />
      <hr />
      <CrossChainTokenSelect selected={toToken} isReceive={true} />
    </ModalLayout>
  );
};
export default Withdraw;
