import { useContext, useMemo, useState } from "react";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import IconGroup from "./IconGroup";
import clsx from "clsx";
import { SwapContext } from "~/context/swap-context";
import { balanceBySlug } from "~/utils/mappings";

const SelectToken = ({ tokens, onSelect }) => {
  const { tokenPrices } = useContext(TokensContext);
  const [search, setSearch] = useState("");

  const { switchSelectMode } = useContext(SwapContext);
  const filteredTokens = useMemo(() => {
    return tokens.filter(({ symbol }) =>
      symbol.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tokens]);

  return (
    <div className="token-list card">
      <label className="label block flex flex-wrap">
        <span className="label-text block w-full mb-2">
          You need an specific token ?
        </span>
        <input
          type="text"
          placeholder="USDC..."
          className="input input-bordered w-full w-full"
          onChange={({ target }) => {
            setSearch(target.value);
          }}
        />
      </label>
      {filteredTokens.map((token, index) => {
        const tokenPrice = Number(tokenPrices[token.coinGeckoId]?.usd);

        const balance = balanceBySlug[token.slug]?.amount ?? 0;

        const convertedBalance = amountToEth(
          !balance ? BigInt(0) : BigInt(balance),
          token.decimals
        );

        const icons = [
          { url: token?.network?.icon, alt: token?.network?.name },
          { url: token?.icon, alt: token?.symbol, small: true },
        ];

        return (
          <div
            key={index}
            className={clsx(
              "flex items-center cursor-pointer py-4 border-white-800 border-b-solid overflow-scroll",
              index !== tokens.length - 1 && "border-b",
              "hover:bg-gray-100"
            )}
            onClick={() => {
              switchSelectMode();
              onSelect(token);
            }}
          >
            <div className="flex w-full">
              <IconGroup icons={icons} className="mr-6" />
              <span className="text-xl mr-2">
                {token?.symbol} ({token.network.name})
              </span>
            </div>
            <div>
              <div className="text-right">
                <span className="whitespace-nowrap block">
                  Balance: {lisibleAmount(convertedBalance)}
                  {token.symbol}
                </span>
              </div>
              <div className="text-xs text-right">
                ~{lisibleAmount(convertedBalance * tokenPrice)}$
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SelectToken;
