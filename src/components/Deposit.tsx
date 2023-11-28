import { useContext } from "react";
import { SwapContext } from "~/context/swap-context";
import { WalletContext } from "~/context/wallet-context";
import CrossChainTokenSelect from "./CrossChainTokenSelect";
import SelectToken from "./SelectToken";
import { tokenBySlug } from "~/utils/mappings";

const Deposit = () => {
  const {
    selectTokenMode,
    fromToken,
    toToken,
    selectFromToken,
    switchSelectMode,
  } = useContext(SwapContext);

  const { balances } = useContext(WalletContext);

  if (selectTokenMode) {
    return (
      <div className="deposit block">
        <div className="box w-full">
          <SelectToken
            tokens={balances
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
          <CrossChainTokenSelect selected={fromToken} />
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
          <button className="btn btn-primary w-full">Deposit</button>
        </div>
      </div>
    </div>
  );
};
export default Deposit;
