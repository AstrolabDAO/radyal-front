import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";

import { ICommonStep } from "@astrolabs/swapper";
import { Client, getContract } from "viem";
import { Strategy } from "../interfaces";
import { OperationType } from "../../constants";

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
    interaction === OperationType.DEPOSIT
      ? strategy.asset.weiPerUnit
      : strategy.weiPerUnit;

  const amount = BigInt(value * weiPerUnit);

  const previewAmount = (
    interaction === OperationType.DEPOSIT
      ? await contract.read.previewDeposit([amount])
      : await contract.read.previewRedeem([amount])
  ) as bigint;

  const fromToken: any =
    interaction === OperationType.DEPOSIT ? strategy.asset : strategy;
  const toToken: any =
    interaction === OperationType.DEPOSIT ? strategy : strategy.asset;

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
    (interaction === OperationType.DEPOSIT
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
  interaction: OperationType;
  value: number;
  address: `0x${string}`;
}
