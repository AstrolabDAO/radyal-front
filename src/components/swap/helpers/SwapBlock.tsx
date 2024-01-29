import { useMemo } from "react";

import clsx from "clsx";

import { amountToEth } from "~/utils/format";
import { Strategy, Token } from "~/utils/interfaces";

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
    { url: icons.background, alt: symbol },
    { url: icons.foreground, alt: network, small: true },
  ];

  return (
    <div className="flex flex-col my-3">
      <div className="mb-1">{label}</div>
      <div className="flex flex-col md:flex-row p-3 border border-solid border-gray-500 rounded-xl bg-dark-600">
        <div
          className={clsx(
            "flex flex-row rounded-xl bg-gray-500 px-3 cursor-pointer my-auto py-2",
            { "hover:bg-primary hover:text-dark": !disabled }
          )}
          onClick={onTokenClick}
        >
          <div className="my-auto">
            <IconGroup icons={iconGroup} />
          </div>
          <div className="flex flex-col ps-3 py-3 bg-medium my-auto">
            <div className="text-2xl font-bold">{symbol}</div>
            <div className="-mt-2 w-32">on {network}</div>
          </div>
        </div>
        <div className="flex flex-col ms-auto my-auto text-right">
          <div
            className={clsx(
              "text-sm flex flex-row align-middle ms-auto bg-gray-200 rounded px-1",
              {
                "cursor-pointer hover:bg-primary hover:text-dark": !disabled,
              }
            )}
            onClick={() => onWalletClick(balance)}
          >
            <WalletIcon className="flex me-1 my-auto h-4 w-4" />
            <span className="flex my-auto"> {balance} </span>
          </div>
          <div className="flex ms-auto ms-auto">{children}</div>
          <div className="text-sm text-gray font-bold">~{tokenPrice} $</div>
        </div>
      </div>
    </div>
  );
};

export default SwapBlock;
