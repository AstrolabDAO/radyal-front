import { useContext } from "react";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import IconGroup from "./IconGroup";
import clsx from "clsx";
import { SwapModalContext } from "~/context/swap-modal-context";

const SelectToken = () => {
  const { tokenPrices } = useContext(TokensContext);
  const { sortedTokens, switchSelectMode, selectToken } =
    useContext(SwapModalContext);
  return (
    <div className="token-list card">
      <h2 className="mb-4">Select input token...</h2>
      {sortedTokens.map((token, index) => {
        const tokenPrice = Number(tokenPrices[token.coingeckoId]?.usd);

        const convertedAmount = amountToEth(
          BigInt(token.amount),
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
              index !== sortedTokens.length - 1 && "border-b",
              "hover:bg-gray-100"
            )}
            onClick={() => {
              switchSelectMode();
              selectToken(token);
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
