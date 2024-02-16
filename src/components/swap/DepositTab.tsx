import clsx from "clsx";
import { useMemo } from "react";

import StrategyHeader from "./StrategyHeader";
import DepositFor from "./deposit/DepositFor";
import DepositWith from "./deposit/DepositWith";

import { useApproveAndDeposit, useSelectedStrategy } from "~/hooks/strategies";

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

import { Operation } from "~/model/operation";
import { openModal } from "~/services/modal";
import { GasDetails } from "../GasDetails";
import { Button } from "../styled";

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

  const operationSimulation = useMemo(
    () =>
      new Operation({
        steps: estimation?.steps ?? [],
        estimation,
      }),
    [estimation]
  );
  return (
    <>
      <div>
        <StrategyHeader strategy={selectedStrategy} />
      </div>
      <div className="flex flex-col pt-3 relative gap-3">
        <DepositWith
          token={fromToken as Token}
          onTokenClick={() =>
            openModal({ modal: "select-token", title: "Token Select" })
          }
        />
        <DepositFor strategy={toToken as Strategy} />
        <GasDetails operation={operationSimulation} />
        <ActionRouteDetail operation={new Operation(operationSimulation)} />
      </div>
      <div className="flex">
        <Button
          big={true}
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
              ? "Swap AND Deposit"
              : "Deposit"}
        </Button>
      </div>
    </>
  );
};

export default DepositTab;
