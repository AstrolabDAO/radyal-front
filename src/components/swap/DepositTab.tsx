import { useContext } from "react";

import DepositWith from './deposit/DepositWith';
import DepositFrom from './deposit/DepositFor';
import DepositInto from './deposit/DepositInto';
import DepositSelectNetwork from './deposit/DepositSelectNetwork';

import SelectTokenModal from "../modals/SelectTokenModal";

import { SwapModalContext } from "~/context/swap-modal-context";
import { StrategyContext } from "~/context/strategy-context";
import { SelectTokenModalMode } from "~/utils/constants";

const DepositTab = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  console.log(selectedStrategy);
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
        strategy={ selectedStrategy }
        onTokenClick={ openChangeTokenModal }
      />
      <DepositFrom strategy={ selectedStrategy } />
      <div className="sticky top-0">
        <button className="btn btn-primary mt-5 w-full">Bridge and Deposit</button>
      </div>
    </div>
  );
};

export default DepositTab;
