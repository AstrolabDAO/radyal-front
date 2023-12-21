import StratV5Abi from "@astrolabs/registry/abis/StrategyV5Agent.json";

import { Client, getContract } from "viem";
import { SwapMode } from "../constants";
import { Strategy, WithdrawRequest } from "../interfaces";
import { ICommonStep } from "@astrolabs/swapper";
import { executeContract } from "~/services/transaction";

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
      : strategy.share.weiPerUnit;
  const amount = BigInt(value * weiPerUnit);

  const previewAmount = (
    swapMode === SwapMode.DEPOSIT
      ? await contract.read.previewDeposit([amount])
      : await contract.read.previewRedeem([amount])
  ) as bigint;

  const fromToken: any =
    swapMode === SwapMode.DEPOSIT ? strategy.asset : strategy.share;
  const toToken: any =
    swapMode === SwapMode.DEPOSIT ? strategy.share : strategy.asset;

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

  const estimation = Number(previewAmount) / strategy.asset.weiPerUnit;

  return {
    estimation: estimation,
    steps: [step],
    request: null,
  };
};

export const withdraw = async ({
  value,
  strategy,
  address,
}: WithdrawRequest) => {
  //await _switchNetwork(strategy.network.id);
  const amount = value * strategy.asset.weiPerUnit;
  return safeWithdraw(strategy.address, amount, address);
};

export const safeWithdraw = async (
  contractAddress: string,
  amount: number,
  receiver: string,
  owner?: string,
  // todo: minAmount from preview withdraw
  minAmount = "0",
  abi = StratV5Abi.abi
) => {
  if (!owner) owner = receiver;
  return await executeContract(
    "safeWithdraw",
    [amount, minAmount, receiver, owner],
    contractAddress,
    abi as any
  );
};

interface PreviewStrategyMoveProps {
  strategy: Strategy;
  swapMode: SwapMode;
  value: number;
}
