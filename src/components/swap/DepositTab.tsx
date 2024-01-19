import { useContext } from "react";

import DepositFor from "./deposit/DepositFor";
import DepositInto from "./deposit/DepositInto";
import DepositSelectNetwork from "./deposit/DepositSelectNetwork";
import DepositWith from "./deposit/DepositWith";

import SelectTokenModal from "../modals/SelectTokenModal";

import SwapRouteDetail from "../SwapRouteDetail";

import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";

import { EstimationContext } from "~/context/estimation-context";
import { useApproveAndDeposit } from "~/hooks/strategy";
import { tokensIsEqual } from "~/utils";
import { SelectTokenModalMode } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";

const DepositTab = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { fromToken, toToken, fromValue, canSwap, actionNeedToSwap } =
    useContext(SwapContext);
  const { swap, needApprove, estimation } = useContext(EstimationContext);

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

      <SwapRouteDetail steps={estimation?.steps ?? []} />
      <div className="sticky top-0">
        <button
          disabled={!canSwap}
          onClick={async () => {
            if (!tokensIsEqual(fromToken, selectedStrategy.asset)) {
              await swap();
            } else {
              await approveAndDeposit(fromValue);
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
