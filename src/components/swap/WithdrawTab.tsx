import WithdrawFor from "./withdraw/WithdrawFor";
import WithdrawWith from "./withdraw/WithdrawWith";

import ActionRouteDetail from "./helpers/ActionRouteDetail";

import { useOpenModal } from "~/hooks/store/modal";
import { useSelectedStrategy } from "~/hooks/store/strategies";
import {
  useEstimatedRoute,
  useFromToken,
  useInteractionNeedToSwap,
  useToToken,
} from "~/hooks/store/swapper";
import { Strategy, Token } from "~/utils/interfaces";
import StrategyHeader from "./StrategyHeader";

const WithdrawTab = () => {
  const fromToken = useFromToken();
  const toToken = useToToken();
  const openModal = useOpenModal();
  function openChangeTokenModal() {
    openModal({ modal: "select-token" });
  }

  const estimation = useEstimatedRoute();
  const interactionNeedToSwap = useInteractionNeedToSwap();
  const selectedStrategy = useSelectedStrategy();
  return (
    <>
      <div>
        <StrategyHeader strategy={selectedStrategy} />
      </div>
      <div className="flex flex-col pt-3 relative gap-3">
        <WithdrawWith strategy={fromToken as Strategy} />
        <WithdrawFor
          token={toToken as Token}
          onTokenClick={openChangeTokenModal}
        />
        <ActionRouteDetail steps={estimation?.steps ?? []} />
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
