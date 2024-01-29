import { useContext, useEffect, useState } from "react";
import { SwapContext } from "~/context/swap-context";
import SwapInput from "./SwapInput";
import SwapRouteDetail from "./SwapRouteDetail";
import ModalLayout, { ModalAction } from "./layout/ModalLayout";

import toast from "react-hot-toast";
import { EstimationContext } from "~/context/estimation-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { useSelectedStrategy } from "~/hooks/store/strategies";
import { useMaxRedeem, useWithdraw } from "~/hooks/strategy";
import { tokensIsEqual } from "~/utils";
import { SelectTokenModalMode } from "~/utils/constants";
import SelectTokenModal from "./modals/SelectTokenModal";
import SwapStepsModal from "./modals/SwapStepsModal";
const Withdraw = () => {
  const selectedStrategy = useSelectedStrategy();
  const {
    selectTokenMode,
    fromToken,
    toToken,
    canSwap,
    actionNeedToSwap,
    switchSelectMode,
    selectFromToken,
    setFromValue,
  } = useContext(SwapContext);
  const { needApprove } = useContext(EstimationContext);

  const { toValue, unlockEstimate, estimationError, swap } =
    useContext(EstimationContext);

  const [locked, setLocked] = useState(false);

  const { openModal } = useContext(SwapModalContext);

  useEffect(() => {
    selectFromToken(selectedStrategy.asset);
  }, [selectedStrategy, selectFromToken]);

  const withdraw = useWithdraw();

  const maxRedeem = useMaxRedeem();
  console.log("🚀 ~ Withdraw ~ maxRedeem:", maxRedeem);

  useEffect(() => {
    unlockEstimate();
  }, [unlockEstimate]);

  useEffect(() => {
    if (!selectTokenMode) return;
    openModal(
      <SelectTokenModal
        mode={SelectTokenModalMode.Withdraw}
        onClose={() => switchSelectMode()}
      />
    );
  }, [selectTokenMode, openModal, selectFromToken, switchSelectMode]);

  const modalActions: ModalAction[] = [
    {
      label: needApprove
        ? "Approve & Withdraw"
        : actionNeedToSwap
          ? "Swap & Withdraw"
          : "Withdraw",
      disabled: !canSwap || locked,
      onClick: async () => {
        const close = openModal(<SwapStepsModal />);
        setLocked(true);
        try {
          await withdraw(toValue);
          toast.success("Withdrawal successful");
          if (!tokensIsEqual(fromToken, toToken)) {
            swap();
          }
          setLocked(false);
        } catch (e) {
          setLocked(false);
          close();
          toast.error(e.message);
        }
      },
    },
  ];

  const { estimation } = useContext(EstimationContext);
  return (
    <ModalLayout actions={modalActions}>
      <div className="flex gap-5 relative w-full flex-col">
        <SwapInput
          locked={true}
          selected={selectedStrategy}
          onChange={(value) => setFromValue(value)}
        />
        <SwapInput selected={toToken} isDestination={true} />
      </div>
      {(toValue !== 0 || estimationError) && (
        <SwapRouteDetail steps={estimation.steps} />
      )}
    </ModalLayout>
  );
};
export default Withdraw;
