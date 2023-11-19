import { useContext, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Token } from "~/utils/interfaces";
import IconGroup from "./IconGroup";
import { amountToEth } from "~/utils/format";
import { TokensContext } from "~/context/tokens-context";

interface Props {
  tokens: Token[];
  selected: Token;
  onSelect: (token: Token) => void;
}
const CrossChainTokenSelect = ({ tokens, selected, onSelect }: Props) => {
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
    const onEth = amountToEth(BigInt(selected.amount), selected.decimals);
    return Math.round(onEth * 10 ** 4) / 10 ** 4;
  }, [selected]);

  const tokenPrice = useMemo(() => {
    if (!selected) return 0;
    const price = Number(tokenPrices[selected.coingeckoId]?.usd);
    return isNaN(price) ? 0 : price;
  }, [tokenPrices, selected]);

  return (
    <div className="p-2 w-full card bg-neutral text-neutral-content active-border">
      {!selected && (
        <span className="loading loading-spinner loading-lg mx-auto block"></span>
      )}
      {selected && (
        <div>
          <header className="flex justify-end text-xs mb-2">
            <span className="w-full">Depositing</span>
            <span className="whitespace-nowrap block mr-2">
              Balance: {selectedAmount}{" "}
            </span>
            <button
              className="btn btn-xs"
              onClick={() => setDepositValue(selectedAmount.toString())}
            >
              max
            </button>
          </header>
          <div className="flex items-center cursor-pointer">
            <IconGroup icons={icons} className="mr-6" />
            <span className="text-2xl mr-2">{selected?.symbol}</span>
            <FaChevronDown className="mr-2" />
            <input
              className="input w-full max-w-xs bg-neutral text-right text-4xl"
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
            <span>
              {Math.round(Number(depositValue) * tokenPrice * 100) / 100}$
            </span>
          </footer>
        </div>
      )}
    </div>
  );
};

export default CrossChainTokenSelect;
