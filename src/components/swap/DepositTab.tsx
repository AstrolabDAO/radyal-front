import { useCallback } from "react";

import DepositFor from "./deposit/DepositFor";
import DepositInto from "./deposit/DepositInto";
import DepositSelectNetwork from "./deposit/DepositSelectNetwork";
import DepositWith from "./deposit/DepositWith";

import { useSelectedStrategy } from "~/hooks/store/strategies";
import { useApproveAndDeposit } from "~/hooks/strategy";

import { SelectTokenModalMode } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";

import SelectTokenModal from "../modals/SelectTokenModal";

import clsx from "clsx";
import { useOpenModal } from "~/hooks/store/modal";
import {
  useCanSwap,
  useEstimatedRoute,
  useFromToken,
  useFromValue,
  useInteractionNeedToSwap,
  useNeedApprove,
  useToToken,
} from "~/hooks/store/swapper";
import SwapRouteDetail from "../SwapRouteDetail";
import { useExectuteSwapperRoute } from "~/hooks/swapper-actions";

const DepositTab = () => {
  const selectedStrategy = useSelectedStrategy();

  const fromToken = useFromToken();
  const toToken = useToToken();
  const fromValue = useFromValue();
  const canSwap = useCanSwap();

  const interactionNeedToSwap = useInteractionNeedToSwap();
  const estimation = useEstimatedRoute();

  const approveAndDeposit = useApproveAndDeposit();

  const openModal = useOpenModal();

  const openChangeTokenModal = useCallback(() => {
    openModal(<SelectTokenModal mode={SelectTokenModalMode.Deposit} />);
  }, [openModal]);

  const executeSwapperRoute = useExectuteSwapperRoute();
  const needApprove = useNeedApprove();
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
      <div className="mb-3 px-4">
        <button
          disabled={!canSwap}
          onClick={async () => {
            if (interactionNeedToSwap) {
              executeSwapperRoute();
            } else {
              await approveAndDeposit(fromValue);
            }
            /*if (!tokensIsEqual(fromToken, selectedStrategy.asset)) {
              await swap();
            } else {*/

            //}
          }}
          className={clsx("btn btn-primary w-full border-0 uppercase")}
        >
          {needApprove
            ? "Approve & Deposit"
            : interactionNeedToSwap
              ? "Swap & Deposit"
              : "Deposit"}
        </button>
      </div>
    </>
  );
};

export default DepositTab;
