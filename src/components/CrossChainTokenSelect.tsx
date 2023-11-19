import { useContext, useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import { Token } from "~/utils/interfaces";
import IconGroup from "./IconGroup";
interface Props {
  selected: Token;
  estimate: (depositValue: string) => void;
  activeSelectTokenMode?: () => void;
}
const CrossChainTokenSelect = ({
  selected,
  estimate,
  activeSelectTokenMode,
}: Props) => {
  const [depositValue, setDepositValue] = useState("");

  const { tokenPrices } = useContext(TokensContext);

  const icons = useMemo(
    () => [
      { url: selected?.network?.icon, alt: selected?.network?.name },
      { url: selected?.icon, alt: selected?.symbol, small: true },
    ],
    [selected]
  );
  const selectedAmount = useMemo(() => {
    if (!selected) return 0;
    return amountToEth(BigInt(selected.amount), selected.decimals);
  }, [selected]);

  const tokenPrice = useMemo(() => {
    if (!selected) return 0;
    const price = Number(tokenPrices[selected.coingeckoId]?.usd);
    return isNaN(price) ? 0 : price;
  }, [tokenPrices, selected]);

  useEffect(() => {
    estimate(depositValue);
  }, [depositValue]);

  return (
    <div className="relative">
      <div className="p-2 w-full card active-border border-gray-200 border-solid border shadow-2xl">
        {!selected && (
          <span className="loading loading-spinner loading-lg mx-auto block"></span>
        )}
        {selected && (
          <div>
            <header className="flex justify-end text-xs mb-2">
              <span className="w-full">Depositing</span>
              <span className="whitespace-nowrap block mr-2">
                Balance: {lisibleAmount(selectedAmount)}{" "}
              </span>
              <button
                className="btn btn-xs"
                onClick={() => setDepositValue(selectedAmount.toString())}
              >
                max
              </button>
            </header>
            <div className="flex items-center cursor-pointer">
              <div
                className="flex items-center"
                onClick={() => {
                  activeSelectTokenMode();
                }}
              >
                <IconGroup icons={icons} className="mr-6" />
                <span className="text-2xl mr-2">{selected?.symbol}</span>
                <FaChevronDown className="mr-2" />
              </div>
              <input
                className="input w-full max-w-xs text-right text-4xl"
                type="text"
                placeholder="100"
                value={depositValue}
                onChange={({ target }) => {
                  setDepositValue(target.value.replace(/[^0-9]/g, ""));
                }}
              />
            </div>
            <footer className="flex justify-end text-xs items-center mt-2">
              <span className="w-full">
                {selected.name} ({selected.network.name})
              </span>
              <i>~</i>
              <span>{lisibleAmount(Number(depositValue) * tokenPrice)}$</span>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossChainTokenSelect;
