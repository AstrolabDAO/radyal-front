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
import toast from "react-hot-toast";

import { EstimationContext } from "~/context/estimation-context";

const Deposit = () => {
  const {
    selectTokenMode,
    fromToken,
    toToken,
    canSwap,
    actionNeedToSwap,
    fromValue,
    selectFromToken,
    switchSelectMode,
    setFromValue,
  } = useContext(SwapContext);

  const { estimation, swap, unlockEstimate, needApprove } =
    useContext(EstimationContext);

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
      label: needApprove
        ? "Approve & Deposit"
        : actionNeedToSwap
          ? "Swap & Deposit"
          : "Deposit",
      disabled: !canSwap || locked,
      onClick: async () => {
        const close = openModal(<SwapStepsModal />);
        try {
          setLocked(true);
          if (actionNeedToSwap) {
            await swap();
          } else {
            await approveAndDeposit(fromValue);
          }
          setLocked(false);
        } catch (e) {
          close();
          toast.error(e.message);
          setLocked(false);
        }
      },
    },
  ];
  useEffect(() => {
    //unlockEstimate();
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
