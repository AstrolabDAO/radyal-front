import { gweiUnits, parseEther, parseGwei } from "viem";
import { Operation } from "~/model/operation";
import Gas from "~/assets/icons/gas.svg?react";
import Slippage from "~/assets/icons/slippage.svg?react";
import { useMemo } from "react";

export const GasDetails = ({ operation }: { operation: Operation }) => {
  const estimation = useMemo(() => operation?.estimation?.request, [operation]);
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
    <div className="flex text-xs">
      <div className="flex w-1/2 items-center">
        <Slippage className="w-6 fill-white" />
        <span className="ml-1">Slippage </span>
        <span className="text-grey-800 mx-4">
          ~ {slippage < 0.1 ? "< 0.1" : Math.round(slippage * 100) / 100} %
        </span>
        ${Math.round(fromValue * (slippage / 100) * 100) / 100}
      </div>
      <div className="flex w-1/2 justify-end items-center">
        <Gas className="w-6 fill-white" />
        <span className="ml-1">Gas </span>
        <span className="block text-gray-200">
          <span className="text-grey-800 mx-4">
            ~ {Math.round(estimation.gasPrice / 10 ** 9)} Gwei
          </span>
        </span>
        ${estimation.totalGasUsd}
      </div>
    </div>
  );
};
