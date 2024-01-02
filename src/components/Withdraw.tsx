import { useContext, useEffect, useState } from "react";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { TokensContext } from "~/context/tokens-context";
import SelectToken from "./SelectToken";
import SwapInput from "./SwapInput";
import SwapRouteDetail from "./SwapRouteDetail";
import ModalLayout, { ModalAction } from "./layout/ModalLayout";

import { tokensIsEqual } from "~/utils";
import { useWithdraw } from "~/hooks/strategy";
import toast from "react-hot-toast";
import SwapStepsModal from "./modals/SwapStepsModal";
import { SwapModalContext } from "~/context/swap-modal-context";
const Withdraw = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const {
    selectTokenMode,
    fromToken,
    toToken,
    toValue,
    selectToToken,
    switchSelectMode,
    selectFromToken,
    setFromValue,
    unlockEstimate,
    canSwap,
    estimationError,
    swap,
  } = useContext(SwapContext);

  const [locked, setLocked] = useState(false);

  const { openModal, closeModal } = useContext(SwapModalContext);

  useEffect(() => {
    selectFromToken(selectedStrategy.asset);
  }, [selectedStrategy, selectFromToken]);

  const { tokens } = useContext(TokensContext);

  const withdraw = useWithdraw();

  useEffect(() => {
    unlockEstimate();
  }, [unlockEstimate]);
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

  const modalActions: ModalAction[] = [
    {
      label: "Withdraw",
      disabled: !canSwap || locked,
      onClick: async () => {
        const close = openModal(<SwapStepsModal />);
        try {
          setLocked(true);

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
      {(toValue !== 0 || estimationError) && <SwapRouteDetail />}
    </ModalLayout>
  );
};
export default Withdraw;
