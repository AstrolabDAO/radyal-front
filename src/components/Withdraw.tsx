import { useContext, useEffect } from "react";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import SwapInput from "./SwapInput";
import SwapRouteDetail from "./SwapRouteDetail";
import ModalLayout, { ModalAction } from "./layout/ModalLayout";

import toast from "react-hot-toast";
import { SwapModalContext } from "~/context/swap-modal-context";
import { useWithdraw } from "~/hooks/strategy";
import { tokensIsEqual } from "~/utils";
import { SelectTokenModalMode } from "~/utils/constants";
import SelectTokenModal from "./modals/SelectTokenModal";
const Withdraw = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const {
    selectTokenMode,
    fromToken,
    toToken,
    toValue,
    switchSelectMode,
    selectFromToken,
    setFromValue,
    unlockEstimate,
    canSwap,
    swap,
  } = useContext(SwapContext);

  const [locked, setLocked] = useState(false);

  const { openModal } = useContext(SwapModalContext);

  useEffect(() => {
    selectFromToken(selectedStrategy.asset);
  }, [selectedStrategy, selectFromToken]);

  const withdraw = useWithdraw();

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
      label: "Withdraw",
      disabled: !canSwap,
      onClick: async () => {
        try {
          const result = await withdraw(toValue);
          toast.success("Withdrawal successful");
          if (!tokensIsEqual(fromToken, toToken)) {
            swap();
          }
        } catch (e) {
          toast.error(e.message);
        }
      },
    },
  ];

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
      {toValue !== 0 && <SwapRouteDetail />}
    </ModalLayout>
  );
};
export default Withdraw;
