import { useContext } from "react";

import DepositFor from "./deposit/DepositFor";
import DepositInto from "./deposit/DepositInto";
import DepositSelectNetwork from "./deposit/DepositSelectNetwork";
import DepositWith from "./deposit/DepositWith";

import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { EstimationContext } from "~/context/estimation-context";

import { useSelectedStrategy } from "~/hooks/store/strategies";
import { useApproveAndDeposit } from "~/hooks/strategy";

import { tokensIsEqual } from "~/utils";
import { SelectTokenModalMode } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";

import SelectTokenModal from "../modals/SelectTokenModal";

import SwapRouteDetail from "../SwapRouteDetail";
import clsx from "clsx";
import { useStore } from "react-redux";

const DepositTab = () => {
  const state = useStore().getState();
  console.log(state);
  const selectedStrategy = useSelectedStrategy();
  const { fromToken, toToken, fromValue, canSwap, actionNeedToSwap } =
    useContext(SwapContext);
  const { swap, needApprove, estimation } = useContext(EstimationContext);

  const approveAndDeposit = useApproveAndDeposit();

  const { openModal } = useContext(SwapModalContext);
  function openChangeTokenModal() {
    openModal(<SelectTokenModal mode={SelectTokenModalMode.Deposit} />);
  }

  return (
    <>
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
    </div>
    <div className="mb-3 mt-5">
      <button
        disabled={!canSwap}
        onClick={async () => {
          if (!tokensIsEqual(fromToken, selectedStrategy.asset)) {
            await swap();
          } else {
            await approveAndDeposit(fromValue);
          }
        }}
        className={ clsx(
          "btn btn-primary mt-5 w-full border-0 uppercase",
        )}
      >
        { needApprove
          ? "Approve & Deposit"
          : actionNeedToSwap
            ? "Swap & Deposit"
            : "Deposit"
        }
      </button>
    </div>
    </>
  );
};

export default DepositTab;
