import WithdrawFor from "./withdraw/WithdrawFor";
import WithdrawWith from "./withdraw/WithdrawWith";

import ActionRouteDetail from "./helpers/OperationRouteDetail";

import { useSelectedStrategy } from "~/hooks/strategies";
import {
  useEstimatedRoute,
  useFromToken,
  useInteractionNeedToSwap,
  useToToken,
} from "~/hooks/swapper";
import { Strategy, Token } from "~/utils/interfaces";
import StrategyHeader from "./StrategyHeader";
import { Operation } from "~/model/operation";
import { openModal } from "~/services/modal";

const WithdrawTab = () => {
  const fromToken = useFromToken();
  const toToken = useToToken();

  const estimation = useEstimatedRoute();
  const interactionNeedToSwap = useInteractionNeedToSwap();
  const selectedStrategy = useSelectedStrategy();

  const operationSimulation = new Operation({
    steps: estimation?.steps ?? [],
  });
  return (
    <>
      <div>
        <StrategyHeader strategy={selectedStrategy} />
      </div>
      <div className="flex flex-col pt-3 relative gap-3">
        <WithdrawWith strategy={fromToken as Strategy} />
        <WithdrawFor
          token={toToken as Token}
          onTokenClick={() => openModal({ modal: "select-token" })}
        />
        <ActionRouteDetail operation={operationSimulation} />
        <div
          onClick={() => {
            if (interactionNeedToSwap) {
              //executeSwapperRoute();
            }
          }}
          className="flex"
        >
          <button className="btn btn-primary w-full">
            Withdraw and Bridge
          </button>
        </div>
      </div>
    </>
  );
};

export default WithdrawTab;
