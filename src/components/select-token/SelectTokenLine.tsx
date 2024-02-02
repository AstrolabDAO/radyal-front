import clsx from "clsx";

import { CoinGeckoPrices, Token } from "~/utils/interfaces";
import { weiToAmount, round } from "~/utils/format";
import { useBalanceByTokenSlug } from "~/hooks/store/tokens";
import IconGroup from "../IconGroup";

type SelectTokenLineProps = {
  token: Token;
  onSelect: (token: Token) => void;
  switchSelectMode: () => void;
  haveBorder: boolean;
  tokenPrices: CoinGeckoPrices;
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
      size: { width: 32, height: 32 },
    },
    {
      url: token?.network?.icon,
      alt: token?.network?.name,
      size: { width: 18, height: 18 },
      classes: "-ms-3 -mb-1",
      small: true,
    },
  ];
  return (
    <div
      className={clsx(
        "flex flex-col cursor-pointer mb-2 px-2 rounded-xl box-content border-solid border-1 border-transparent",
        haveBorder && "border-b",
        "hover:bg-primary/5 hover:border-primary"
      )}
      onClick={ onTokenSelect }
    >
      <div className="flex flex-row w-full items-center">
        <div className="my-auto">
          <IconGroup icons={ icons }/>
        </div>
        <div className="flex flex-col ps-1.5 pe-3 py-3 bg-medium my-auto">
          <div className="text-xl font-bold text-white group-hover:text-primary">{ token.symbol }</div>
          <div className="-mt-2 pt-1 text-nowrap text-xs">on { token.network.name }</div>
        </div>
        <div className="ms-auto">
          <span className="whitespace-nowrap flex flex-col">
            <span className="font-bold text-white">
              {round(convertedBalance, 4)}
            </span>
            <span className="text-xs">
              ~{round(convertedBalance * tokenPrice, 4)} $
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
export default SelectTokenLine;