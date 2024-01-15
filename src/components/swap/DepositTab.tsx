import { useContext, useState } from "react";

import DepositWith from "./deposit/DepositWith";
import DepositFor from "./deposit/DepositFor";
import DepositInto from "./deposit/DepositInto";
import DepositSelectNetwork from "./deposit/DepositSelectNetwork";

import SelectTokenModal from "../modals/SelectTokenModal";

import SwapRouteDetail from "../SwapRouteDetail";

import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { StrategyContext } from "~/context/strategy-context";

import { SelectTokenModalMode } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";
import SwapStepsModal from "../modals/SwapStepsModal";
import { tokensIsEqual } from "~/utils";
import toast from "react-hot-toast";
import { useApproveAndDeposit } from "~/hooks/strategy";
import { EstimationContext } from "~/context/estimation-context";

const DepositTab = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { fromToken, toToken, fromValue, canSwap, actionNeedToSwap } =
    useContext(SwapContext);
  const { swap, needApprove } = useContext(EstimationContext);
  const [locked, setLocked] = useState(false);

  const approveAndDeposit = useApproveAndDeposit();

  const { openModal } = useContext(SwapModalContext);
  function openChangeTokenModal() {
    openModal(<SelectTokenModal mode={SelectTokenModalMode.Deposit} />);
  }

  return (
    <div className="flex flex-col px-3 pt-3 relative">
      <div className="flex md:flex-row flex-col">
        <DepositInto strategy={selectedStrategy} />
        <DepositSelectNetwork />
      </div>
      <DepositWith
        token={fromToken as Token}
        onTokenClick={openChangeTokenModal}
      />
      <DepositFor strategy={toToken as Strategy} />

      <SwapRouteDetail />
      <div className="sticky top-0">
        <button
          disabled={!canSwap || locked}
          onClick={async () => {
            const close = openModal(<SwapStepsModal />);
            try {
              console.log("ok");
              setLocked(true);
              if (!tokensIsEqual(fromToken, selectedStrategy.asset)) {
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
          }}
          className="btn btn-primary mt-5 w-full button-primary-gradient button-primary-gradient-inverse border-0"
        >
          {needApprove
            ? "Approve & Deposit"
            : actionNeedToSwap
              ? "Swap & Deposit"
              : "Deposit"}
        </button>
      </div>
    </div>
  );
};

export default DepositTab;
