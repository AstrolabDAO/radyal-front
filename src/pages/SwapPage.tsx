import { FaArrowDown } from "react-icons/fa";
import CrossChainTokenSelect from "~/components/CrossChainTokenSelect";

import { useFromToken, useToToken } from "~/hooks/store/swapper";

const SwapPage = () => {
  return <SwapPageContent />;
};
const SwapPageContent = () => {
  const fromToken = useFromToken();
  const toToken = useToToken();
  return (
    <div>
      <h1>Bridge tokens</h1>
      <div className="deposit block">
        <div className="box w-full">
          <>
            <CrossChainTokenSelect selected={fromToken} />
            <div className="text-center text-primary text-2xl my-2">
              <FaArrowDown className="mx-auto block" />
            </div>
            <CrossChainTokenSelect selected={toToken} />
          </>
        </div>
        <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse">
          <div className="flex w-full justify-center">
            <button className="btn btn-primary w-full">Deposit</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SwapPage;
