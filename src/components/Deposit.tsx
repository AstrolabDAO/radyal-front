import { useContext, useEffect, useState } from "react";
import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { TokensContext } from "~/context/tokens-context";

import { SelectTokenModalMode } from "~/utils/constants";
import SwapInput from "./SwapInput";
import SwapRouteDetail from "./SwapRouteDetail";
import ModalLayout, { ModalAction } from "./layout/ModalLayout";
import SelectTokenModal from "./modals/SelectTokenModal";
import SwapStepsModal from "./modals/SwapStepsModal";

import { useApproveAndDeposit } from "~/hooks/strategy";
import { tokensIsEqual } from "~/utils";

const Deposit = () => {
  const {
    selectTokenMode,
    fromToken,
    toToken,
    estimation,
    fromValue,
    selectFromToken,
    switchSelectMode,
  } = useContext(SwapContext);

  const { setFromValue, swap, canSwap, unlockEstimate } =
    useContext(SwapContext);

  const [locked, setLocked] = useState(false);

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

  const approveAndDeposit = useApproveAndDeposit();
  const modalActions: ModalAction[] = [
    {
      label: "Deposit",
      disabled: !canSwap || locked,
      onClick: async () => {
        setLocked(true);
        try {
          if (!tokensIsEqual(fromToken, toToken)) {
            await swap();
            openModal(<SwapStepsModal />);
          } else {
            await approveAndDeposit(fromValue);
          }
          setLocked(false);
        } catch (e) {
          setLocked(false);
        }
      },
    },
  ];
  useEffect(() => {
    unlockEstimate();
  }, [unlockEstimate]);

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
