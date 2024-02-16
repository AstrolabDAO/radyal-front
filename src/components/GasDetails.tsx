import { gweiUnits, parseEther, parseGwei } from "viem";
import { Operation } from "~/model/operation";
import Gas from "~/assets/icons/gas.svg?react";
import Slippage from "~/assets/icons/slippage.svg?react";
import { useMemo } from "react";
import { useFromValue } from "~/hooks/swapper";
import clsx from "clsx";

export const GasDetails = ({ operation }: { operation: Operation }) => {
  const estimation = useMemo(() => operation?.estimation?.request, [operation]);
  // TODO -> CONVERT TO DOLLARD
  const [fromValue, slippage] = useMemo(() => {
    if (!estimation) return [null, null];
    const firstStep = estimation.steps[0];
    const lastStepBeforeCall = estimation.steps[estimation.steps.length - 2];
    const fromToken = firstStep.fromToken;
    const toToken = lastStepBeforeCall.toToken;
    const fromValue = firstStep.fromAmount / 10 ** fromToken.decimals;
    const toValue = lastStepBeforeCall.toAmount / 10 ** toToken.decimals;

    const slippage = ((fromValue - toValue) / fromValue) * 100;

    return [fromValue, slippage];
  }, [operation, estimation]);

  if (!estimation) return;

  return (
    <div className="flex">
      <div className="flex w-1/2 items-center">
        <Slippage className="w-6 fill-white" />
        <span className="ml-2">Slippage </span>
        <span className={clsx("text-darkGrey mx-2")}>
          ~{Math.round(slippage * 100) / 100} %
        </span>
        <span
          className={clsx("text-darkGrey", {
            "text-positive": slippage < 0,
            "text-negative": slippage > 0,
          })}
        >
          ${(Math.round(fromValue * (slippage / 100) * 100) / 100) * -1}
        </span>
      </div>
      <div className="flex w-1/2 justify-end items-center">
        <Gas className="w-6 fill-white" />
        <span className="ml-2">Gas </span>

        <span className="mx-2 text-darkGrey">
          ~ {Math.round(estimation.gasPrice / 10 ** 9)} Gwei
        </span>
        <span className="text-negative">${estimation.totalGasUsd}</span>
      </div>
    </div>
  );
};
