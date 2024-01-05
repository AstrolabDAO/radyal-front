import { useContext } from "react";

import DepositWith from './deposit/DepositWith';
import DepositFor from './deposit/DepositFor';
import DepositInto from './deposit/DepositInto';
import DepositSelectNetwork from './deposit/DepositSelectNetwork';

import SelectTokenModal from "../modals/SelectTokenModal";


import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { StrategyContext } from "~/context/strategy-context";

import { SelectTokenModalMode } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";

const DepositTab = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { fromToken, toToken } = useContext(SwapContext);
  const { openModal } = useContext(SwapModalContext);
  function openChangeTokenModal() {
    openModal(<SelectTokenModal mode={ SelectTokenModalMode.Deposit } />);
  }

  return (
    <div className="flex flex-col px-3 pt-3 relative">
      <div className="flex md:flex-row flex-col">
        <DepositInto strategy={ selectedStrategy }/>
        <DepositSelectNetwork />
      </div>
      <DepositWith
        token={ fromToken as Token }
        onTokenClick={ openChangeTokenModal }
      />
      <DepositFor
        strategy={ toToken as Strategy }
      />
      <div className="sticky top-0">
        <button className="btn btn-primary mt-5 w-full button-primary-gradient button-primary-gradient-inverse border-0">Bridge and Deposit</button>
      </div>
    </div>
  );
};

export default DepositTab;
