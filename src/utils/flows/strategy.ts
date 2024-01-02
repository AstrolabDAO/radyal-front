import StratV5Abi from "@astrolabs/registry/abis/StrategyV5Agent.json";

import { ICommonStep } from "@astrolabs/swapper";
import { Client, getContract } from "viem";
import { SwapMode } from "../constants";
import { Strategy } from "../interfaces";

export const previewStrategyTokenMove = async (
  { strategy, swapMode, value }: PreviewStrategyMoveProps,
  publicClient: Client
) => {
  const contract = getContract({
    address: strategy.address,
    abi: StratV5Abi.abi,
    publicClient,
  });

  if (![SwapMode.DEPOSIT, SwapMode.WITHDRAW].includes(swapMode))
    throw new Error("Invalid mode");

  const weiPerUnit =
    swapMode === SwapMode.DEPOSIT
      ? strategy.asset.weiPerUnit
      : strategy.weiPerUnit;
  const amount = BigInt(value * weiPerUnit);

  const previewAmount = (
    swapMode === SwapMode.DEPOSIT
      ? await contract.read.previewDeposit([amount])
      : await contract.read.previewRedeem([amount])
  ) as bigint;

  const fromToken: any =
    swapMode === SwapMode.DEPOSIT ? strategy.asset : strategy;
  const toToken: any =
    swapMode === SwapMode.DEPOSIT ? strategy : strategy.asset;

  const step: ICommonStep = {
    type: swapMode,
    tool: "radyal",
    fromChain: strategy.network.id,
    toChain: strategy.network.id,
    estimate: {
      fromAmount: amount.toString(),
      toAmount: previewAmount.toString(),
    },
    fromToken,
    toToken,
  };

  const estimation =
    Number(previewAmount) /
    (swapMode === SwapMode.DEPOSIT
      ? strategy.weiPerUnit
      : strategy.asset.weiPerUnit);

  return {
    estimation: estimation,
    steps: [step],
    request: null,
  };
};

interface PreviewStrategyMoveProps {
  strategy: Strategy;
  swapMode: SwapMode;
  value: number;
}
