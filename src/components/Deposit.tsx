import { ethers } from "ethers";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { StrategyContext } from "~/context/strategy-context";
import { WalletContext } from "~/context/wallet-context";
import { getRoute } from "~/utils/squid";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import ReceiveInput from "./ReceiveInput";
import SelectToken from "./SelectToken";
let debounceTimer;
const Deposit = () => {
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

  const sortedTokens = useMemo(() => {
    return balances.sort((a, b) =>
      BigInt(a.amount) > BigInt(b.amount) ? -1 : 1
    );
  }, [balances]);

  const [selectedToken, setSelectedToken] = useState(sortedTokens?.[1] ?? null);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  useEffect(() => {
    if (!selectedToken) setSelectedToken(sortedTokens?.[1] ?? null);
  }, [sortedTokens, selectedToken]);

  return (
    <div className="deposit block">
      <div className="box w-full">
        {selectTokenMode && (
          <SelectToken
            tokens={sortedTokens}
            onSelect={(token) => {
              setSelectTokenMode(false);
              setSelectedToken(token);
            }}
          />
        )}
        {!selectTokenMode && (
          <>
            <h2 className="text-sm text-primary mb-4 mt-4">
              Deposit to strategy...
            </h2>
            <CrossChainTokenSelect
              estimate={(depositValue: string) => estimate(depositValue)}
              activeSelectTokenMode={() => setSelectTokenMode(true)}
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
          <button className="btn btn-primary">Deposit</button>
        </div>
      </div>
    </div>
  );
};
export default Deposit;
