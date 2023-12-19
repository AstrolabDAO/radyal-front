import { useContext, useEffect } from "react";
import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { TokensContext } from "~/context/tokens-context";

import ModalLayout from "./layout/ModalLayout";
import SelectTokenModal from "./modals/SelectTokenModal";
import SwapInput from "./SwapInput";
import SwapRouteDetail from "./SwapRouteDetail";
import SwapStepsModal from "./modals/SwapStepsModal";
import { tokensIsEqual } from "~/utils";
import { SelectTokenModalMode } from "~/utils/constants";

const Deposit = () => {
  const {
    selectTokenMode,
    fromToken,
    toToken,
    estimation,
    selectFromToken,
    switchSelectMode,
  } = useContext(SwapContext);

  const { setFromValue, swap } = useContext(SwapContext);

  const { openModal } = useContext(SwapModalContext);

  const { sortedBalances } = useContext(TokensContext);

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
      onClick: async () => {
        if (!tokensIsEqual(fromToken, toToken)) {
          swap();
          openModal(<SwapStepsModal />);
        } else {
          // deposit
        }
      },
    },
  ];

  return (
    <ModalLayout actions={modalActions}>
      <div className="flex gap-5 relative w-full flex-col">
        <SwapInput
          selected={fromToken}
          onChange={(value) => setFromValue(Number(value))}
        />
        <SwapInput selected={toToken} isDestination={true} locked={true} />
      </div>
      {estimation && <SwapRouteDetail />}
    </ModalLayout>
  );
};
export default Deposit;
