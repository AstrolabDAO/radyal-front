import clsx from "clsx";
import { useCallback } from "react";

import DepositFor from "./deposit/DepositFor";
import StrategyHeader from "./StrategyHeader";
import DepositSelectNetwork from "./deposit/DepositSelectNetwork";
import DepositWith from "./deposit/DepositWith";

import { useSelectedStrategy } from "~/hooks/strategies";
import { useApproveAndDeposit } from "~/hooks/strategies";

import { Strategy, Token } from "~/utils/interfaces";

import {
  useCanSwap,
  useEstimatedRoute,
  useFromToken,
  useFromValue,
  useInteractionNeedToSwap,
  useNeedApprove,
  useToToken,
} from "~/hooks/swapper";
import { useExectuteSwapperRoute } from "~/hooks/swapper-actions";

import ActionRouteDetail from "./helpers/OperationRouteDetail";
import Button from "../Button";
import { Operation } from "~/model/operation";
import { openModal } from "~/services/modal";
import { GasDetails } from "../GasDetails";

const DepositTab = () => {
  const selectedStrategy = useSelectedStrategy();

  const fromToken = useFromToken();
  const toToken = useToToken();
  const fromValue = useFromValue();
  const canSwap = useCanSwap();

  const interactionNeedToSwap = useInteractionNeedToSwap();
  const estimation = useEstimatedRoute();

  const approveAndDeposit = useApproveAndDeposit();

  const executeSwapperRoute = useExectuteSwapperRoute();
  const needApprove = useNeedApprove();

  const operationSimulation = new Operation({
    steps: estimation?.steps ?? [],
    estimation,
  });
  return (
    <>
      <div>
        <StrategyHeader strategy={selectedStrategy} />
      </div>
      <div className="flex flex-col pt-3 relative gap-3">
        <DepositWith
          token={fromToken as Token}
          onTokenClick={() => openModal({ modal: "select-token" })}
        />
        <DepositFor strategy={toToken as Strategy} />
        <GasDetails operation={operationSimulation} />
        <ActionRouteDetail operation={new Operation(operationSimulation)} />
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
