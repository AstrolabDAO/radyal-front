import { useContext } from "react";
import { StrategyContext } from "~/context/strategy-context";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import ReceiveInput from "./ReceiveInput";
const Withdraw = () => {
  const { selectedStrategy } = useContext(StrategyContext);

  return (
    <div className="deposit block">
      <div className="box w-full">
        <CrossChainTokenSelect
          selected={selectedStrategy.token}
          locked={true}
        />
        <div className="text-center"></div>
        <ReceiveInput />
      </div>
      <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse">
        <div className="flex w-full justify-center">
          <button className="btn btn-primary w-full">Withdraw</button>
        </div>
      </div>
    </div>
  );
};
export default Withdraw;
