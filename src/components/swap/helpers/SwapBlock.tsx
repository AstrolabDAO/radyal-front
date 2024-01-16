import { useMemo } from "react";

import clsx from "clsx";

import { Strategy, Token } from '~/utils/interfaces';
import { amountToEth, lisibleAmount } from "~/utils/format";

import { WalletIcon } from "@heroicons/react/24/solid";
import IconGroup from "~/components/IconGroup";
import { useBalanceByTokenSlug, usePrices } from "~/hooks/store/tokens";

type SwapBlockProps = {
  disabled?: boolean;
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
  onTokenClick,
  onWalletClick,
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
      classes: "-ms-2",
      size: {
        width: 15,
        height: 15,
      },
      small: true,
    },
  ];

  return (
    <div className="flex flex-col my-3">
      <div className="mb-1">{ label }</div>
      <div className="flex flex-col md:flex-row px-3 py-2 rounded-xl bg-dark-600">
        <div className={
          clsx("flex flex-row rounded-xl my-auto py-0 ps-2 pe-0",
          {
            "cursor-pointer hover:bg-primary hover:text-dark bg-gray-500" : !disabled,
            'border-2 border-solid border-gray-500': disabled
          },
        )}
          onClick={ onTokenClick }
        >
          { symbol && network &&
            <>
              <div className="my-auto">
                <IconGroup icons={ iconGroup }/>
              </div>
              <div className="flex flex-col ps-3 py-2 bg-medium my-auto">
                <div className="text-2xl font-bold">{ symbol }</div>
                <div className="-mt-2 w-32">on { network }</div>
              </div>
            </>
          }
          { (!symbol || !network) &&
            <div
              className="py-6 text-center font-bold text-2xl"
              style={{ minWidth: "calc(240px - 1.5rem)" }}
            >
              SELECT A TOKEN
            </div>
          }
        </div>
        <div className="flex flex-col ms-auto my-auto text-right">
          <div
            className={
              clsx("text-sm flex rounded-xl flex-row align-middle ms-auto rounded px-1", {
              "cursor-pointer hover:bg-primary hover:text-dark" : !disabled,
              "bg-dark-600" : disabled,
              "bg-dark-800" : !disabled,
            })}
            onClick={ () => onWalletClick(balance) }
          >
            <WalletIcon className="flex me-1 my-auto h-4 w-4" />
            <span className="flex my-auto"> {balance} </span>
          </div>
          <div className="flex ms-auto ms-auto">
            { children }
          </div>
          <div className="text-sm text-gray font-light">~{ lisibleAmount(tokenPrice, 4) } $</div>
        </div>
      </div>
    </div>
  );
};

export default SwapBlock;
