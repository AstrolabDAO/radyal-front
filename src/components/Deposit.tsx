import { useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { TokensContext } from "~/context/tokens-context";
import { useGenerateAndSwap } from "~/hooks/swap";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import SelectTokenModal, {
  SelectTokenModalMode,
} from "./modals/SelectTokenModal";

const Deposit = () => {
  const {
    selectTokenMode,
    fromToken,
    toToken,
    selectFromToken,
    switchSelectMode,
  } = useContext(SwapContext);

  const { address } = useAccount();
  const { fromValue, updateFromValue } = useContext(SwapContext);

  const { openModal } = useContext(SwapModalContext);
  const { selectedStrategy } = useContext(StrategyContext);
  const { sortedBalances } = useContext(TokensContext);

  const generateAndSwap = useGenerateAndSwap(fromToken);

  useEffect(() => {
    if (!selectTokenMode) return;
    openModal(
      <SelectTokenModal
        mode={SelectTokenModalMode.Deposit}
        onClose={() => switchSelectMode()}
      />
    );
  }, [
    selectTokenMode,
    openModal,
    sortedBalances,
    selectFromToken,
    switchSelectMode,
  ]);

  return (
    <div className="deposit block">
      <div className="box w-full">
        <>
          <CrossChainTokenSelect
            selected={fromToken}
            onChange={(value) => updateFromValue(value)}
          />
          <hr />
          <CrossChainTokenSelect
            locked={true}
            isReceive={true}
            selected={toToken}
          />
        </>
      </div>
      <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse">
        <div className="flex w-full justify-center">
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              generateAndSwap({
                address,
                fromToken,
                toToken,
                amount: Number(fromValue),
                strat: selectedStrategy,
              });
            }}
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
};
export default Deposit;
