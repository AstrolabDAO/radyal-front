import CrossChainTokenSelect from "./CrossChainTokenSelect";
import ReceiveInput from "./ReceiveInput";

const Deposit = () => {
  return (
    <div className="deposit block">
      <div className="box w-full">
        <>
          <CrossChainTokenSelect />
          <div className="text-center text-primary text-2xl my-2">to</div>
          <ReceiveInput />
        </>
      </div>
      <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse">
        <div className="flex w-full justify-center">
          <button className="btn btn-primary w-full">Deposit</button>
        </div>
      </div>
    </div>
  );
};
export default Deposit;
