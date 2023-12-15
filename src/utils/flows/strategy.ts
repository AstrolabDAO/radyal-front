import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";

import { Client, getContract } from "viem";
import { SwapMode } from "../constants";
import { Strategy, WithdrawRequest } from "../interfaces";
import { _switchNetwork } from "../web3";
import { BigNumberish } from "ethers";
import { ICommonStep } from "@astrolabs/swapper";

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

  const amount = BigInt(value * strategy.token.weiPerUnit);

  const previewAmount = (
    swapMode === SwapMode.DEPOSIT
      ? await contract.read.previewDeposit([amount])
      : await contract.read.previewWithdraw([amount])
  ) as bigint;

  const step: ICommonStep = {
    type: swapMode,
    tool: "radyal",
    fromChain: strategy.network.id,
    toChain: strategy.network.id,
    estimate: {
      fromAmount: amount.toString(),
      toAmount: previewAmount.toString(),
    },
    fromToken: strategy.token as any,
    toToken: strategy.token as any,
  };

  const estimation = Number(previewAmount) / strategy.token.weiPerUnit;

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
  await _switchNetwork(strategy.network.id);
  const amount = value * strategy.token.weiPerUnit;
  return safeWithdraw(strategy.address, amount, address);
};

export const safeWithdraw = async (
  contractAddress: string,
  amount: BigNumberish,
  receiver: string,
  owner?: string,
  // todo: minAmount from preview withdraw
  minAmount = "0",
  abi = StratV5Abi.abi
) => {
  if (!owner) owner = receiver;
  return await writeTx(
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
