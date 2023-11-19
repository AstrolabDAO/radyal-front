import { getRoute } from "~/utils/squid";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { StrategyContext } from "~/context/strategy-context";
import { toast } from "react-toastify";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
let debounceTimer;
const WithdrawInput = ({ estimate }) => {
  const { selectedStrategy } = useContext(StrategyContext);
  const [depositValue, setDepositValue] = useState("");
  const [receiveEstimation, setReceiveEstimation] = useState(null);
  /*
  const estimate = (depositValue: string) => {

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!selectedToken || !depositValue) return;
      const promise = getRoute({
        fromChain: selectedStrategy?.network.id,
        fromToken: selectedStrategy?.token,
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
  */

  const [selectedToken, setSelectedToken] = useState(sortedTokens?.[1] ?? null);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  return (
    <div className="deposit block">
      <div className="box w-full">
        {!selectTokenMode && (
          <>
            <CrossChainTokenSelect
              estimate={(depositValue: string) => {}}
              //activeSelectTokenMode={() => setSelectTokenMode(true)}
              selected={selectedToken}
            />
            {receiveEstimation && (
              <div className="text-center text-primary text-2xl my-2">To</div>
            )}

            <ReceiveInput receive={receiveEstimation} />
          </>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <div className="flex w-full justify-center">
          <button className="btn btn-primary mx-2">Approve & deposit</button>
          <button className="btn btn-primary">Deposit</button>
        </div>
      </div>
    </div>
  );
};
export default WithdrawInput;
