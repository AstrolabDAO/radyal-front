import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StrategyContext } from "~/context/strategy-context";
import { WalletContext } from "~/context/wallet-context";
import { getRoute } from "~/utils/squid";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import ReceiveInput from "./ReceiveInput";
let debounceTimer;
const Withdraw = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { balances } = useContext(WalletContext);
  const [tempo, setTempo] = useState(false);
  const [receiveEstimation, setReceiveEstimation] = useState(null);

  const estimate = (depositValue: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!selectedToken || !depositValue) return;
      const promise = getRoute({
        fromChain: selectedToken.network.id,
        fromToken: selectedToken.address,
        fromAmount: ethers
          .parseUnits(depositValue, selectedToken.decimals)
          .toString(),
      })
        .then((result) => {
          const { estimate, params } = result;
          const { fromToken, toToken } = params;
          setReceiveEstimation({
            route: result,
            fromToken,
            toToken,
            toAmountUSD: estimate.toAmountUSD,
            toAmount: Number(estimate.toAmount) / 10 ** params.toToken.decimals,
          });
        })
        .catch(() => {
          toast.error("route not found from Swapper");
        });
      toast.promise(promise, {
        pending: "Calculating...",
        error: "route not found from Swapper 🤯",
      });
    }, 1000);
  };

  const [selectedToken, setSelectedToken] = useState(selectedStrategy?.token);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  useEffect(() => {
    if (!selectedToken) setSelectedToken(selectedStrategy?.token);
  }, [selectedToken, selectedStrategy]);

  return (
    <div className="deposit block">
      <div className="box w-full">
        {!selectTokenMode && (
          <>
            <h2 className="text-sm text-primary mb-4 mt-4">
              Withdraw from strategy...
            </h2>
            <CrossChainTokenSelect />

            <div className="text-center"></div>
            <ReceiveInput />
          </>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <div className="flex w-full justify-center">
          <button className="btn btn-primary">Withdraw</button>
        </div>
      </div>
    </div>
  );
};
export default Withdraw;
