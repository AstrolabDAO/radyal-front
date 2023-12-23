import { useContext } from "react";

import DepositWith from './deposit/DepositWith';
import DepositFrom from './deposit/DepositFor';
import DepositInto from './deposit/DepositInto';
import DepositSelectNetwork from './deposit/DepositSelectNetwork';

import { StrategyContext } from "~/context/strategy-context";

const DepositTab = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedStrategy } = useContext(StrategyContext);
  return (
    <div className="flex flex-col p-3">
      <div className="flex flex-row mb-3">
        <DepositInto />
        <DepositSelectNetwork />
      </div>
      <DepositWith strategy={ selectedStrategy } />
      <DepositFrom />
      <button className="btn btn-medium my-3">Deposit and Bridge</button>
    </div>
  );
};

export default DepositTab;
