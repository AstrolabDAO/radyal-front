import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";

import { ICommonStep } from "@astrolabs/swapper";
import { Client, getContract } from "viem";
import { Strategy } from "../interfaces";
import { StrategyInteraction } from "../constants";

export const previewStrategyTokenMove = async (
  { strategy, interaction, value, address }: PreviewStrategyMoveProps,
  publicClient: Client
) => {
  const contract: any = getContract({
    address: strategy.address,
    abi: StratV5Abi.abi,
    publicClient,
  });

  const weiPerUnit =
    interaction === StrategyInteraction.DEPOSIT
      ? strategy.asset.weiPerUnit
      : strategy.weiPerUnit;

  const amount = BigInt(value * weiPerUnit);

  const previewAmount = (
    interaction === StrategyInteraction.DEPOSIT
      ? await contract.read.previewDeposit([amount])
      : await contract.read.previewRedeem([amount])
  ) as bigint;

  const fromToken: any =
    interaction === StrategyInteraction.DEPOSIT ? strategy.asset : strategy;
  const toToken: any =
    interaction === StrategyInteraction.DEPOSIT ? strategy : strategy.asset;

  const step: ICommonStep = {
    type: interaction,
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
    (interaction === StrategyInteraction.DEPOSIT
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
  interaction: StrategyInteraction;
  value: number;
  address: `0x${string}`;
}
