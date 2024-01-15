import StratV5Abi from "@astrolabs/registry/abis/StrategyV5Agent.json";

import { ICommonStep } from "@astrolabs/swapper";
import { Client, getContract } from "viem";
import { Strategy } from "../interfaces";
import { StrategyInteraction } from "../constants";

export const previewStrategyTokenMove = async (
  { strategy, action, value }: PreviewStrategyMoveProps,
  publicClient: Client
) => {
  const contract = getContract({
    address: strategy.address,
    abi: StratV5Abi.abi,
    publicClient,
  });

  if (
    ![StrategyInteraction.DEPOSIT, StrategyInteraction.WITHDRAW].includes(
      action
    )
  )
    throw new Error("Invalid mode");

  const weiPerUnit =
    action === StrategyInteraction.DEPOSIT
      ? strategy.asset.weiPerUnit
      : strategy.weiPerUnit;
  const amount = BigInt(value * weiPerUnit);

  const previewAmount = (
    action === StrategyInteraction.DEPOSIT
      ? await contract.read.previewDeposit([amount])
      : await contract.read.previewRedeem([amount])
  ) as bigint;

  const fromToken: any =
    action === StrategyInteraction.DEPOSIT ? strategy.asset : strategy;
  const toToken: any =
    action === StrategyInteraction.DEPOSIT ? strategy : strategy.asset;

  const step: ICommonStep = {
    type: action,
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
    (action === StrategyInteraction.DEPOSIT
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
  action: StrategyInteraction;
  value: number;
}
