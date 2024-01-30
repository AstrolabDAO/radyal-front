import clsx from "clsx";

import { CoingeckoPrices, Token } from "~/utils/interfaces";
import { amountToEth, lisibleAmount } from "~/utils/format";
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

  const convertedBalance = amountToEth(
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
        "flex flex-col cursor-pointer mb-2 pt-2.5 pb-1.5 px-2 rounded-xl",
        haveBorder && "border-b",
        "hover:bg-primary hover:text-dark"
      )}
      onClick={ onTokenSelect }
    >
      <div className="flex flex-row w-full items-center">
        <IconGroup icons={icons} />
        <div className="ms-4">
          <span className="text-xl font-bold"> {token?.symbol} </span>
          <span className="text-xs">
            ({token.network.name})
          </span>
        </div>
        <div className="ms-auto">
          <span className="whitespace-nowrap block">
            <span className="font-bold">
              {lisibleAmount(convertedBalance, 4)} </span>
              {token.symbol}
          </span>
        </div>
      </div>
      <div className="ms-auto -mt-2 text-xs">
        ~{lisibleAmount(convertedBalance * tokenPrice, 4)} $
      </div>
    </div>
  )
}
export default SelectTokenLine;