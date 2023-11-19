import { useContext } from "react";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import IconGroup from "./IconGroup";

const SelectToken = ({ tokens, onSelect }) => {
  const { tokenPrices } = useContext(TokensContext);
  return (
    <div className="token-list card shadow-2xl">
      {tokens.map((token) => {
        const tokenPrice = Number(tokenPrices[token.coingeckoId]?.usd);
        console.log(
          "🚀 ~ file: SelectToken.tsx:12 ~ tokenPrice:",
          token.slug,
          tokenPrices
        );

        const convertedAmount = amountToEth(
          BigInt(token.amount),
          token.decimals
        );
        console.log(
          "🚀 ~ file: SelectToken.tsx:17 ~ {tokens.map ~ convertedAmount:",
          convertedAmount
        );
        console.log(
          "🚀 ~ file: SelectToken.tsx:12 ~ {tokens.map ~ tokenPrice:",
          tokenPrice
        );

        const icons = [
          { url: token?.network?.icon, alt: token?.network?.name },
          { url: token?.icon, alt: token?.symbol, small: true },
        ];

        return (
          <div className="flex items-center cursor-pointer p-4 border-white-800 border-b-solid border-b">
            <div
              className="flex w-full"
              onClick={() => {
                onSelect(token);
              }}
            >
              <IconGroup icons={icons} className="mr-6" />
              <span className="text-2xl mr-2">
                {token?.symbol} ({token.network.name})
              </span>
            </div>
            <div>
              <div className="text-right">
                <span className="whitespace-nowrap block">
                  Balance: {lisibleAmount(convertedAmount)}
                  {token.symbol}
                </span>
              </div>
              <div className="text-xs text-right">
                ~{lisibleAmount(convertedAmount * tokenPrice)}$
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SelectToken;
