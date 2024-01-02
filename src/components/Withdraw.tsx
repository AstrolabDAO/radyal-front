import { useContext, useEffect } from "react";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { TokensContext } from "~/context/tokens-context";
import SelectToken from "./SelectToken";
import SwapInput from "./SwapInput";
import SwapRouteDetail from "./SwapRouteDetail";
import ModalLayout, { ModalAction } from "./layout/ModalLayout";

import { usePreviewStrategyTokenMove } from "~/hooks/swap";
import { tokensIsEqual } from "~/utils";
import { useWithdraw } from "~/hooks/strategy";
import toast from "react-hot-toast";
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
    swap,
  } = useContext(SwapContext);

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
      disabled: !canSwap,
      onClick: async () => {
        try {
          const result = await withdraw(toValue);
          console.log(
            "🚀 ~ file: Withdraw.tsx:62 ~ onClick: ~ result:",
            result
          );
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
