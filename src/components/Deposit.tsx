import { useContext } from "react";
import { SwapContext } from "~/context/swap-context";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import SelectToken from "./SelectToken";
import { tokenBySlug } from "~/utils/mappings";
import { TokensContext } from "~/context/tokens-context";
import { StrategyContext } from "~/context/strategy-context";
import { useAccount } from "wagmi";
import { useGenerateAndSwap } from "~/hooks/swap";

const Deposit = () => {
  const {
    selectTokenMode,
    fromToken,
    toToken,
    selectFromToken,
    switchSelectMode,
  } = useContext(SwapContext);
  const { address } = useAccount();
  const { fromValue, updateFromValue } = useContext(SwapContext);

  const { selectedStrategy } = useContext(StrategyContext);
  const { sortedBalances } = useContext(TokensContext);

  const generateAndSwap = useGenerateAndSwap(fromToken)

  if (selectTokenMode) {
    return (
      <div className="deposit block">
        <div className="box w-full">
          <SelectToken
            tokens={sortedBalances
              .filter((balance) => {
                const token = tokenBySlug[balance.slug];
                if (!token) return false;
                return true;
              })
              .map((balance) => tokenBySlug[balance.slug])}
            onSelect={(token) => {
              selectFromToken(token);
              switchSelectMode();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="deposit block">
      <div className="box w-full">
        <>
          <CrossChainTokenSelect
            selected={fromToken}
            onChange={(value) => updateFromValue(value)}
          />
          <hr />
          <CrossChainTokenSelect
            locked={true}
            isReceive={true}
            selected={toToken}
          />
        </>
      </div>
      <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse">
        <div className="flex w-full justify-center">
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              generateAndSwap({
                address,
                fromToken,
                toToken,
                amount: Number(fromValue),
                strat: selectedStrategy,
              });
            }}
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
};
export default Deposit;
