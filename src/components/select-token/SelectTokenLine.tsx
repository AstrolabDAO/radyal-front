import clsx from "clsx";

import { CoingeckoPrices, Token } from "~/utils/interfaces";
import { weiToAmount, round } from "~/utils/format";
import { useBalanceByTokenSlug } from "~/hooks/store/tokens";
import IconGroup from "../IconGroup";

type SelectTokenLineProps = {
  token: Token;
  onSelect: (token: Token) => void;
  switchSelectMode: () => void;
  haveBorder: boolean;
  tokenPrices: CoingeckoPrices;
}

const SelectTokenLine = ({
  token,
  onSelect,
  switchSelectMode,
  haveBorder,
  tokenPrices,
}: SelectTokenLineProps) => {
  function onTokenSelect() {
    switchSelectMode();
    onSelect(token);
  }
  const convertedPrice = Number(tokenPrices[token.coinGeckoId]?.usd);

  const tokenPrice = isNaN(convertedPrice) ? 0 : convertedPrice;
  const balanceByTokenSlug = useBalanceByTokenSlug();
  const balance = balanceByTokenSlug[token.slug]?.amountWei ?? 0;

  const convertedBalance = weiToAmount(
    !balance ? BigInt(0) : BigInt(balance),
    token.decimals
  );
  const icons = [
    {
      url: token?.icon,
      alt: token?.symbol,
      size: { width: 30, height: 30 },
    },
    {
      url: token?.network?.icon,
      alt: token?.network?.name,
      size: { width: 15, height: 15 },
      classes: "-ms-2",
      small: true,
    },
  ];
  return (
    <div
      className={clsx(
        "flex flex-col cursor-pointer mb-2 pt-2.5 pb-1.5 px-2 rounded-xl box-content border-solid border-1 border-transparent",
        haveBorder && "border-b",
        "hover:bg-primary/5 hover:border-primary"
      )}
      onClick={ onTokenSelect }
    >
      <div className="flex flex-row w-full items-center">
        <IconGroup icons={icons} />
        <div className="ms-4">
          <span className="text-xl font-bold text-white"> {token?.symbol} </span>
          <span className="text-xs">
            ({token.network.name})
          </span>
        </div>
        <div className="ms-auto">
          <span className="whitespace-nowrap block">
            <span className="font-bold text-white">
              {round(convertedBalance, 4)} </span>
          </span>
        </div>
      </div>
      <div className="ms-auto -mt-2 text-xs">
        ~{round(convertedBalance * tokenPrice, 4)} $
      </div>
    </div>
  )
}
export default SelectTokenLine;