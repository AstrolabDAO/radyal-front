import { useMemo } from "react";
import Gas from "~/assets/icons/gas.svg?react";
import Slippage from "~/assets/icons/slippage.svg?react";
import { useFromToken } from "~/hooks/swapper";
import { usePrices } from "~/hooks/tokens";
import { Operation } from "~/model/operation";

import { ICommonStep } from "@astrolabs/swapper";
import clsx from "clsx";
import { toDollarsAuto, toPercent } from "~/utils/format";

export const GasDetails = ({ operation }: { operation: Operation }) => {
  const estimation = useMemo(() => operation?.estimation?.request, [operation]);
  // TODO -> CONVERT TO DOLLARD
  const fromToken = useFromToken();

  const tokenPrices = usePrices();

  const [slippage, slippageUsd] = useMemo(() => {
    if (!estimation) return [null, null];

    const firstStep = estimation.steps[0];
    const lastStepBeforeCall = estimation.steps[
      estimation.steps.length - 2
    ] as ICommonStep;
    const fromValue = firstStep.fromAmount / 10 ** fromToken.decimals;
    const toValue =
      Number(lastStepBeforeCall.toAmount) /
      10 ** lastStepBeforeCall.toToken.decimals;

    const getPrice = (t: any) => {
      let p = 0;
      if (t.coinGeckoId) {
        p = tokenPrices[t.coinGeckoId]?.usd;
      } else if (t.priceUSD) {
        p = t.priceUSD;
      } else if (t.sharePrice) {
        if (t.asset) p = (getPrice(t.asset) * t.sharePrice) / t.weiPerUnit;
      }
      return Number(p);
    };

    let fromPrice = getPrice(fromToken);
    let toPrice = getPrice(lastStepBeforeCall.toToken);

    const fromValueUsd = fromValue * fromPrice;
    const toValueUsd = toValue * toPrice;
    const slippageUsd = fromValueUsd - toValueUsd;
    const slippage = slippageUsd / fromValueUsd;

    return [slippage, slippageUsd];
  }, [operation, estimation]);

  if (!estimation) return;

  return (
    <div className="flex">
      <div className="flex w-1/2 items-center">
        <Slippage className="w-6 fill-base-content" />
        <span className="ml-2">Slippage </span>
        <span className={clsx("text-darkGrey mx-2")}>
          ~{toPercent(slippage)}
        </span>
        <span
          className={clsx("text-darkGrey", {
            "text-positive": slippage < 0,
            "text-negative": slippage > 0,
          })}
        >
          {toDollarsAuto(slippageUsd)}
        </span>
      </div>
      <div className="flex w-1/2 justify-end items-center">
        <Gas className="w-6 fill-base-content" />
        <span className="ml-2">Gas </span>
        <span className="mx-2 text-darkGrey">
          {Math.round(estimation.gasPrice / 10 ** 9)} Gwei
        </span>
        <span className="text-negative">${estimation.totalGasUsd}</span>
      </div>
    </div>
  );
};
