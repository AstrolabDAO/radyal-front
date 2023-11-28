import { useContext } from "react";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import IconGroup from "./IconGroup";
import clsx from "clsx";
import { SwapContext } from "~/context/swap-context";
import { balanceBySlug } from "~/utils/mappings";

const SelectToken = ({ tokens, onSelect }) => {
  console.log("🚀 ~ file: SelectToken.tsx:9 ~ SelectToken ~ tokens:", tokens);
  const { tokenPrices } = useContext(TokensContext);
  const { switchSelectMode } = useContext(SwapContext);
  return (
    <div className="token-list card">
      <h2 className="mb-4">Select input token...</h2>
      {tokens.map((token, index) => {
        const tokenPrice = Number(tokenPrices[token.coinGeckoId]?.usd);
        console.log(
          "🚀 ~ file: SelectToken.tsx:18 ~ {tokens.map ~ tokenPrices:",
          tokenPrices
        );

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
            key={token.slug}
            className={clsx(
              "flex items-center cursor-pointer p-4 border-white-800 border-b-solid overflow-scroll",
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
