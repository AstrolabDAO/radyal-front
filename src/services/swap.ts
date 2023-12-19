import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import {
  ITransactionRequestWithEstimate,
  getAllTransactionRequests,
} from "@astrolabs/swapper";
import { erc20Abi } from "abitype/abis";
import { encodeFunctionData, parseGwei } from "viem";
import { tokensIsEqual } from "~/utils";
import { SwapMode } from "~/utils/constants";
import { overrideZeroAddress } from "~/utils/format";
import { LifiRequest } from "~/utils/interfaces";
import { PrepareSendTransactionArgs } from "@wagmi/core";
import { executeTransaction } from "./transaction";
import { Token } from "~/utils/interfaces";

import { PublicClient } from "wagmi";
import { approve } from "./strategy";
import { toast } from "react-toastify";

export const depositCallData = (address: string, toAmount: string) => {
  return generateCallData({
    abi: AgentABI,
    functionName: "safeDeposit",
    args: [toAmount, "0", address],
  });
};

export const generateCallData = ({
  functionName,
  args,
  abi = erc20Abi,
}: GenerateCallDataProps) => {
  return encodeFunctionData({
    abi,
    functionName,
    args,
  });
};

export const getSwapRoute = async (params: LifiRequest) => {
  const { fromToken, toToken, address, amount, swapMode, strategy } = params;

  if (tokensIsEqual(fromToken, toToken)) {
    return [
      {
        to: address,
        data: "0x00",
        estimatedExchangeRate: 1, // 1:1 exchange rate
        estimatedOutputWei: amount,
        estimatedOutput: Number(amount) / fromToken.weiPerUnit,
      },
    ];
  }
  const customContractCalls = [];

  if (swapMode === SwapMode.DEPOSIT) {
    const callData = await depositCallData(address, amount.toString());
    customContractCalls.push({
      toAddress: strategy.address,
      callData,
    });
  }

  const quoteOpts: any = {
    aggregatorId: ["LIFI", "SQUID"],
    inputChainId: fromToken.network.id,
    input: overrideZeroAddress(fromToken.address),
    amountWei: Math.round(Number(amount) - Number(amount) * 0.02), // because if not 2%, the fromAmount is lower. Why ? I don't know.
    outputChainId: toToken.network.id,
    output: overrideZeroAddress(toToken.address),
    maxSlippage: 50,
    payer: address,
    customContractCalls: customContractCalls.length
      ? customContractCalls
      : undefined,
  };

  if (customContractCalls.length) {
    quoteOpts.postHook = [
      {
        callData: customContractCalls[0].callData,
      },
    ];
  }

  return getAllTransactionRequests(quoteOpts);
};

interface GenerateCallDataProps {
  functionName: any;
  abi: any;
  args: any[];
}

export const executeSwap = async (route: ITransactionRequestWithEstimate) => {
  if (!route) return;
  if (route.maxFeePerGas) delete route.maxFeePerGas;
  if (route.maxPriorityFeePerGas) delete route.maxPriorityFeePerGas;
  const params: PrepareSendTransactionArgs = {
    ...route,
    gas: parseGwei("0.00001"),
  };

  const { hash } = await executeTransaction(params);

  console.log("lifiExplorer: ", `https://explorer.li.fi/tx/${hash}`);
  console.log("squidExplorer: ", `https://axelarscan.io/gmp/${hash}`);
  console.log("hash: ", hash);
  return hash;
};

export const aproveAndSwap = async (
  { route, allowance, routerAddress, fromToken, amount }: ExecuteSwapProps,
  publicClient: PublicClient
) => {
  if (allowance !== null && amount > allowance) {
    try {
      const { hash: approveHash } = await approve(
        routerAddress,
        amount.toString(),
        fromToken.address
      );

      const approvePending = publicClient.waitForTransactionReceipt({
        hash: approveHash,
      });
      toast.promise(approvePending, {
        pending: "Approve is pending...",
        success: "Approve transaction successful",
        error: "approve reverted rejected 🤯",
      });
      await approvePending;
    } catch (err) {
      console.log("🚀 ~ file: swap.ts:130 ~ err:", err);
      toast.error(`An error has occured`);
    }
    const swapHash = await executeSwap(route);
    const swapPending = publicClient.waitForTransactionReceipt({
      hash: swapHash,
    });
    toast.promise(swapPending, {
      pending: "Swap transaction is pending...",
      success: "Swap transaction successful",
      error: "Swap reverted rejected 🤯",
    });
    await swapPending;
    return route;
  }
  await executeSwap(route);
  return route;
};

interface ExecuteSwapProps {
  route: ITransactionRequestWithEstimate;
  allowance: bigint | null;
  routerAddress: `0x${string}`;
  fromToken: Token;
  amount: bigint;
}
