import { useContext } from "react";

import WithdrawWith from './withdraw/WithdrawWith';
import WithdrawFor from './withdraw/WithdrawFor';

import SelectTokenModal from "../modals/SelectTokenModal";

import SwapRouteDetail from "../SwapRouteDetail";

import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";

import { SelectTokenModalMode } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";
import { EstimationContext } from "~/context/estimation-context";

const WithdrawTab = () => {
  const { fromToken, toToken } = useContext(SwapContext);
  const { openModal } = useContext(SwapModalContext);
  function openChangeTokenModal() {
    openModal(<SelectTokenModal mode={ SelectTokenModalMode.Withdraw } />);
  }
  const { estimation } = useContext(EstimationContext);

  return (
    <div className="flex flex-col px-3 pt-3 relative">
      <WithdrawWith
        strategy={ fromToken as Strategy }
      />
      <WithdrawFor
        token={ toToken as Token }
        onTokenClick={ openChangeTokenModal }
      />

      { estimation && estimation.steps &&
        <SwapRouteDetail steps={ estimation.steps }/>
      }
      <div className="sticky top-0">
        <button className="btn btn-primary mt-5 w-full button-primary-gradient button-primary-gradient-inverse border-0">
          Withdraw and Bridge
        </button>
      </div>
    </div>
  );
};

export default WithdrawTab;
