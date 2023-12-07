import { useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { TokensContext } from "~/context/tokens-context";
import { useGenerateAndSwap } from "~/hooks/swap";

import ModalLayout from "./layout/ModalLayout";
import SelectTokenModal, {
  SelectTokenModalMode,
} from "./modals/SelectTokenModal";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import SwapInput from "./SwapInput";

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

  const modalActions = [
    {
      label: "Deposit",
      onClick: () => {
        generateAndSwap({
          address,
          fromToken,
          toToken,
          amount: Number(fromValue),
          strat: selectedStrategy,
        });
      },
    },
  ];
  return (
    <ModalLayout actions={modalActions}>
      <div className="flex gap-5 relative w-full mb-6 pt-6">
        <CrossChainTokenSelect
          selected={fromToken}
          //onChange={(value) => updateFromValue(value)}
        />

        <CrossChainTokenSelect
          locked={true}
          //isReceive={true}
          selected={toToken}
        />
      </div>
      <div className="flex gap-5 relative w-full flex-col">
        <SwapInput
          selected={fromToken}
          onChange={(value) => updateFromValue(value)}
        />
        <SwapInput selected={toToken} isDestination={true} />
      </div>
    </ModalLayout>
  );
};
export default Deposit;
