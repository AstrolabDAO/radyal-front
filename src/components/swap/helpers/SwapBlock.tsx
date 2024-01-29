import { useMemo } from "react";

import clsx from "clsx";

import { Strategy, Token } from '~/utils/interfaces';
import { amountToEth, lisibleAmount } from "~/utils/format";

import { WalletIcon } from "@heroicons/react/24/solid";
import IconGroup from "~/components/IconGroup";
import { useBalanceByTokenSlug, usePrices } from "~/hooks/store/tokens";

type SwapBlockProps = {
  disabled?: boolean;
  isFocused?: boolean;
  label: string;
  symbol: string;
  network: string;
  token: Token | Strategy;
  children: React.ReactNode;
  icons: { background: string; foreground: string };
  value: number;
  onTokenClick: () => void;
  onWalletClick?: (walletBalance: number) => void;
};

const SwapBlock = ({
  label,
  symbol,
  icons,
  network,
  token,
  children,
  disabled,
  value,
  isFocused = false,
  onTokenClick,
  onWalletClick = () => {},
}: SwapBlockProps) => {
  const tokenPrices = usePrices();
  const balanceBySlug = useBalanceByTokenSlug();
  const balance = useMemo(() => {
    if (!token) return 0;
    const balance = balanceBySlug[token.slug];

    return amountToEth(BigInt(balance?.amountWei ?? 0), token.decimals);
  }, [balanceBySlug, token]);

  const tokenPrice = useMemo(() => {
    if (!token || !tokenPrices) return 0;

    let price = Number(tokenPrices[token.coinGeckoId]?.usd);

    // check if token is a strategy
    if ("sharePrice" in token) {
      const { sharePrice, asset, weiPerUnit } = token;
      price =
        (Number(tokenPrices[asset.coinGeckoId]?.usd) * sharePrice) / weiPerUnit;
    }
    return isNaN(price * value) ? 0 : price * value;
  }, [tokenPrices, token, value]);

  const iconGroup = [
    {
      alt: symbol,
      url: icons.background,
      size: {
        width: 32,
        height: 32,
      }
    },
    {
      url: icons.foreground,
      alt: network,
      classes: "-ms-3 -mb-1",
      size: {
        width: 18,
        height: 18,
      },
      small: true,
    },
  ];

  return (
    <div className="flex flex-col my-3">
      <div className="mb-1">{ label }</div>
      <div
        className={clsx(
          "flex flex-col md:flex-row p-2 rounded-xl border-1 border-solid",
          {
            "bg-dark-700": !disabled,
            "border-dark-500": disabled,
            "border-primary/50": isFocused,
            "border-transparent": !isFocused && !disabled,
          }
      )}>
        <div className={
          clsx("flex flex-row rounded-xl my-auto py-0 ps-2",
          {
            "group cursor-pointer bg-dark-550 hover:bg-primary/5 hover:ring-1 hover:ring-primary/25" : !disabled,
          },
        )}
          onClick={ onTokenClick }
        >
          { symbol && network &&
            <>
              <div className="my-auto">
                <IconGroup icons={ iconGroup }/>
              </div>
              <div className="flex flex-col ps-1.5 pe-3 py-3 bg-medium my-auto">
                <div className="text-xl font-bold text-secondary-900 group-hover:text-primary">{ symbol }</div>
                <div className="-mt-2 pt-1 text-nowrap text-xs">on { network }</div>
              </div>
            </>
          }
          { (!symbol || !network) &&
            <div className="py-6 text-center font-bold text-xl">
              SELECT A TOKEN
            </div>
          }
        </div>
        <div className="flex flex-col ms-auto my-auto text-right">
          <div
            className={
              clsx("text-xs flex rounded-md flex-row align-middle ms-auto rounded", {
              "cursor-pointer hover:bg-primary hover:text-dark px-1" : !disabled,
              "bg-transparent text-dark-500" : disabled,
              "bg-dark-550" : !disabled,
            })}
            onClick={ () => onWalletClick(balance) }
          >
            <WalletIcon className="flex me-1 my-auto h-3 w-3"/>
            <span className="flex my-auto"> { balance } </span>
          </div>
          <div className="flex ms-auto">
            { children }
          </div>
          <div className="text-xs text-dark-500 font-light">~{ lisibleAmount(tokenPrice, 4) } $</div>
        </div>
      </div>
    </div>
  );
};

export default SwapBlock;
