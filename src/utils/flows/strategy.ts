import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";

import { createPublicClient, getContract, http } from "viem";
import { OperationStep } from "~/model/operation";
import { ActionInteraction } from "~/store/swapper";
import { networkToWagmiChain } from "../format";
import { Estimation, Strategy } from "../interfaces";

export const previewStrategyTokenMove = async ({
  strategy,
  interaction,
  value,
}: PreviewStrategyMoveProps): Promise<Estimation> => {
  const publicClient = createPublicClient({
    transport: http(),
    chain: networkToWagmiChain(strategy.network),
  });
  const contract: any = getContract({
    address: strategy.address,
    abi: StratV5Abi.abi,
    client: {
      public: publicClient as never,
    },
  });

  const weiPerUnit =
    interaction === ActionInteraction.DEPOSIT
      ? strategy.asset.weiPerUnit
      : strategy.weiPerUnit;

  const amount = BigInt(value * weiPerUnit);

  const previewAmount = (
    interaction === ActionInteraction.DEPOSIT
      ? await contract.read.previewDeposit([amount])
      : await contract.read.previewRedeem([amount])
  ) as bigint;

  const fromToken: any =
    interaction === ActionInteraction.DEPOSIT ? strategy.asset : strategy;
  const toToken: any =
    interaction === ActionInteraction.DEPOSIT ? strategy : strategy.asset;

  const step: OperationStep = {
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
    (interaction === ActionInteraction.DEPOSIT
      ? strategy.weiPerUnit
      : strategy.asset.weiPerUnit);

  return {
    id: window.crypto.randomUUID(),
    estimation: estimation,
    steps: [step],
    request: null,
  };
};

interface PreviewStrategyMoveProps {
  strategy: Strategy;
  interaction: ActionInteraction;
  value: number;
}
