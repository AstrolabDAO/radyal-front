import clsx from "clsx";
import { useCallback } from "react";

import DepositFor from "./deposit/DepositFor";
import StrategyHeader from "./StrategyHeader";
import DepositSelectNetwork from "./deposit/DepositSelectNetwork";
import DepositWith from "./deposit/DepositWith";

import { useSelectedStrategy } from "~/hooks/store/strategies";
import { useApproveAndDeposit } from "~/hooks/strategy";

import { Strategy, Token } from "~/utils/interfaces";

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
import { useExectuteSwapperRoute } from "~/hooks/swapper-actions";

import ActionRouteDetail from "./helpers/ActionRouteDetail";
import Button from "../Button";

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
    openModal({ modal: "select-token" });
  }, [openModal]);

  const executeSwapperRoute = useExectuteSwapperRoute();
  const needApprove = useNeedApprove();
  return (
    <>
      <div>
        <StrategyHeader strategy={selectedStrategy} />
      </div>
      <div className="flex flex-col pt-3 relative gap-3">
        <DepositWith
          token={fromToken as Token}
          onTokenClick={openChangeTokenModal}
        />
        <DepositFor strategy={toToken as Strategy} />

        <ActionRouteDetail steps={estimation?.steps ?? []} />
      </div>
      <div className="flex">
        <Button
          disabled={!canSwap}
          onClick={async () => {
            if (interactionNeedToSwap) {
              executeSwapperRoute();
            } else {
              await approveAndDeposit(fromValue);
            }
          }}
          className={clsx("w-full border-0 uppercase")}
        >
          {needApprove
            ? "Approve & Deposit"
            : interactionNeedToSwap
              ? "Swap & Deposit"
              : "Deposit"}
        </Button>
      </div>
    </>
  );
};

export default DepositTab;
