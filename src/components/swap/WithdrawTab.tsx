import WithdrawFor from "./withdraw/WithdrawFor";
import WithdrawWith from "./withdraw/WithdrawWith";

import SelectTokenModal from "../modals/SelectTokenModal";

import SwapRouteDetail from "../SwapRouteDetail";

import { useOpenModal } from "~/hooks/store/modal";
import {
  useEstimatedRoute,
  useFromToken,
  useToToken,
} from "~/hooks/store/swapper";
import { SelectTokenModalMode } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";

const WithdrawTab = () => {
  const fromToken = useFromToken();
  const toToken = useToToken();
  const openModal = useOpenModal();
  function openChangeTokenModal() {
    openModal(<SelectTokenModal mode={SelectTokenModalMode.Withdraw} />);
  }

  const estimation = useEstimatedRoute();

  return (
    <div className="flex flex-col px-3 pt-3 relative">
      <WithdrawWith strategy={fromToken as Strategy} />
      <WithdrawFor
        token={toToken as Token}
        onTokenClick={openChangeTokenModal}
      />

      {estimation && estimation.steps && (
        <SwapRouteDetail steps={estimation.steps} />
      )}
      <div className="sticky top-0">
        <button className="btn btn-primary mt-5 w-full button-primary-gradient button-primary-gradient-inverse border-0">
          Withdraw and Bridge
        </button>
      </div>
    </div>
  );
};

export default WithdrawTab;
