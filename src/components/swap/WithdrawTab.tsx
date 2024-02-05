import WithdrawFor from "./withdraw/WithdrawFor";
import WithdrawWith from "./withdraw/WithdrawWith";

import SelectTokenModal from "../modals/SelectTokenModal";

import SwapRouteDetail from "./helpers/SwapRouteDetail";

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
    <div className="flex flex-col pt-3 relative gap-3">
      <WithdrawWith
        strategy={ fromToken as Strategy }
      />
      <WithdrawFor
        token={toToken as Token}
        onTokenClick={openChangeTokenModal}
      />

      { estimation && estimation.steps &&
        <SwapRouteDetail steps={ estimation.steps }/>
      }
      <div className="flex">
        <button className="btn btn-primary w-full">
          Withdraw and Bridge
        </button>
      </div>
    </div>
  );
};

export default WithdrawTab;
