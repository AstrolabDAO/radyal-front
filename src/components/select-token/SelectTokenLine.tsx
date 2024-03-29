import clsx from "clsx";

import { CoinGeckoPrices, Token } from "~/utils/interfaces";
import { weiToAmount, round } from "~/utils/maths";
import { useBalanceByTokenSlug } from "~/hooks/tokens";
import TokenPresentation from "../TokenPresentation";
import { useCallback } from "react";

type SelectTokenLineProps = {
  token: Token;
  onSelect: (token: Token) => void;
  switchSelectMode: () => void;
  haveBorder: boolean;
  tokenPrices: CoinGeckoPrices;
};

const SelectTokenLine = ({
  token,
  onSelect,
  switchSelectMode,
  haveBorder,
  tokenPrices,
}: SelectTokenLineProps) => {
  const onTokenSelect = useCallback(() => {
    switchSelectMode();
    onSelect(token);
  }, [switchSelectMode, onSelect, token]);

  const convertedPrice = Number(tokenPrices[token.coinGeckoId]?.usd);

  const tokenPrice = isNaN(convertedPrice) ? 0 : convertedPrice;
  const balanceByTokenSlug = useBalanceByTokenSlug();
  const balance = balanceByTokenSlug[token.slug]?.amountWei ?? 0;

  const convertedBalance = weiToAmount(
    !balance ? BigInt(0) : BigInt(balance),
    token.decimals
  );
  return (
    <div
      className={clsx(
        "flex flex-col cursor-pointer p-2 rounded-xl box-content border-solid border-2 border-transparent",
        haveBorder && "border-b",
        "bordered-hover"
      )}
      onClick={onTokenSelect}
    >
      <div className="flex flex-row w-full items-center">
        <TokenPresentation token={token} />
        <div className="ms-auto">
          <span className="whitespace-nowrap flex flex-col">
            <span className="font-bold text-white text-right">
              {round(convertedBalance, 4)}
            </span>
            <span className="text-xs text-right">
              ~{round(convertedBalance * tokenPrice, 4)} $
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default SelectTokenLine;
