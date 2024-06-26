import clsx from "clsx";
import { useMemo } from "react";

import { Strategy, Token } from "~/utils/interfaces";
import { weiToAmount, round } from "~/utils/maths";

import {
  useBalanceByTokenSlug,
  usePrices,
  useTokenIsLoaded,
} from "~/hooks/tokens";

import { WalletIcon } from "@heroicons/react/24/solid";
import TokenPresentation from "~/components/TokenPresentation";

type ActionBlockProps = {
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

const ActionBlock = ({
  label,
  symbol,
  network,
  token,
  children,
  disabled,
  value,
  isFocused = false,
  onTokenClick,
  onWalletClick = () => {},
}: ActionBlockProps) => {
  const tokenPrices = usePrices();
  const balanceBySlug = useBalanceByTokenSlug();
  const balance = useMemo(() => {
    if (!token) return 0;
    const balance = balanceBySlug[token.slug];

    return weiToAmount(BigInt(balance?.amountWei ?? 0), token.decimals);
  }, [balanceBySlug, token]);

  const balanceEquivalent = useMemo(() => {
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

  const tokenIsLoaded = useTokenIsLoaded();

  return (
    <div className="flex flex-col">
      <div className="mb-1 font-medium">{label}</div>
      <div
        className={clsx(
          "flex flex-row p-2 pr-4 rounded-[1.15rem] border-1 border-solid",
          {
            "bg-dark-700": !disabled,
            "border-darkGrey": disabled,
            "border-primary/50": isFocused,
            "border-transparent": !isFocused && !disabled,
            "shimmer border-none": !tokenIsLoaded,
          }
        )}
      >
        <div
          className={clsx("flex flex-row rounded-xl py-0 ps-2", {
            "group cursor-pointer bg-dark-550 border-transparent bordered-hover":
              !disabled,
          })}
          onClick={onTokenClick}
        >
          {symbol && network && <TokenPresentation token={token} />}
        </div>

        <div
          className={clsx("flex flex-col ms-auto my-auto text-right", {
            "opacity-0": !tokenIsLoaded,
          })}
        >
          <div
            className={clsx(
              "text-xs flex rounded-md flex-row align-middle ms-auto rounded",
              {
                "cursor-pointer hover:bg-primary hover:text-dark px-1":
                  !disabled,
                "bg-transparent text-dark-500": disabled,
                "bg-dark-550": !disabled,
              }
            )}
            onClick={() => onWalletClick(balance)}
          >
            <WalletIcon className="flex me-1 my-auto h-3 w-3" />
            <span className="flex my-auto"> {round(balance, 4)} </span>
          </div>
          <div className="flex ms-auto text-white">{children}</div>
          <div className="text-md text-dark-500 font-light leading-none">
            ~{round(balanceEquivalent, 4)} $
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBlock;
