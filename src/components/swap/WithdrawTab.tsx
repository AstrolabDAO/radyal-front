import WithdrawFor from "./withdraw/WithdrawFor";
import WithdrawWith from "./withdraw/WithdrawWith";

import ActionRouteDetail from "./helpers/OperationRouteDetail";

import { useSelectedStrategy, useWithdraw } from "~/hooks/strategies";
import {
  useCanSwap,
  useEstimatedRoute,
  useFromToken,
  useFromValue,
  useInteractionNeedToSwap,
  useToToken,
} from "~/hooks/swapper";
import { Strategy, Token } from "~/utils/interfaces";
import StrategyHeader from "./StrategyHeader";
import { Operation } from "~/model/operation";
import { closeModal, openModal } from "~/services/modal";
import { Button } from "../styled";
import { switchChain } from "wagmi/actions";
import { useChainId } from "wagmi";
import { getWagmiConfig } from "~/services/web3";
import Modal from "../Modal";
import { setLocked } from "~/store/swapper";
import toast from "react-hot-toast";
import { tokensIsEqual } from "~/utils";
import { executeSwapperRoute } from "~/services/swapper";

const WithdrawTab = () => {
  const fromToken = useFromToken();
  const toToken = useToToken();
  const estimation = useEstimatedRoute();
  const interactionNeedToSwap = useInteractionNeedToSwap();
  const selectedStrategy = useSelectedStrategy();
  const currentChain = useChainId();

  const operationSimulation = new Operation({
    steps: estimation?.steps ?? [],
    estimation,
  });

  const canSwap = useCanSwap();
  const withdraw = useWithdraw();

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
      </div>
      <div className="flex">
        <Button
          big={true}
          onClick={async () => {
            if (currentChain !== fromToken.network.id)
              await switchChain(getWagmiConfig(), {
                chainId: fromToken?.network?.id,
              });
            openModal({
              modal: "steps",
            });
            try {
              const operation = await withdraw(estimation.estimation);
              if (interactionNeedToSwap) {
                await executeSwapperRoute(operation);
              }
              setLocked(false);
            } catch (e) {
              console.error(e);
              setLocked(false);
              closeModal();
              toast.error("An error has occured");
            }
          }}
          disabled={!canSwap}
          className="btn btn-primary w-full"
        >
          {interactionNeedToSwap ? "Withdraw and Swap" : "Withdraw"}
        </Button>
      </div>
    </>
  );
};

export default WithdrawTab;
