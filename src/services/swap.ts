import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import {
  ITransactionRequestWithEstimate,
  getAllTransactionRequests,
} from "@astrolabs/swapper";
import { erc20Abi } from "abitype/abis";
import { encodeFunctionData, getContract, parseGwei } from "viem";
import { tokensIsEqual } from "~/utils";
import { SwapMode } from "~/utils/constants";
import { overrideZeroAddress } from "~/utils/format";
import { LifiRequest } from "~/utils/interfaces";
import { PrepareSendTransactionArgs } from "@wagmi/core";
import { approve, executeTransaction } from "./transaction";
import { Token } from "~/utils/interfaces";

import { PublicClient } from "wagmi";
import toast from "react-hot-toast";

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

  if (
    swapMode === SwapMode.DEPOSIT
    //&&fromToken.network.id !== toToken.network.id
  ) {
    const callData = depositCallData(address, amount.toString());
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

  console.log("🚀 ~ file: swap.ts:96 ~ executeSwap ~ route:", route);
  const { hash } = await executeTransaction(params);

  console.log("lifiExplorer: ", `https://explorer.li.fi/tx/${hash}`);
  console.log("squidExplorer: ", `https://axelarscan.io/gmp/${hash}`);
  console.log("hash: ", hash);
  return { hash };
};

export const aproveAndSwap = async (
  { route, fromToken, amount, clientAddress }: ExecuteSwapProps,
  publicClient: PublicClient
) => {
  const routerAddress = route ? route?.to : null;

  const contract = getContract({
    address: fromToken.address,
    abi: erc20Abi,
    publicClient: publicClient as any,
  }) as any;
  console.log("🚀 ~ file: swap.ts:123 ~ fromToken:", fromToken);

  const allowance: bigint = (await contract.read.allowance([
    clientAddress,
    routerAddress,
  ])) as bigint;

  const approvalAmount = amount + amount / 500n; // 5%
  console.log("allowance", routerAddress, allowance, approvalAmount, amount);
  if (allowance !== null && approvalAmount > allowance) {
    try {
      const { hash: approveHash } = await approve({
        spender: routerAddress as `0x${string}`,
        amount: approvalAmount,
        address: fromToken.address,
        chainId: fromToken.network.id,
      });

      const approvePending = publicClient.waitForTransactionReceipt({
        hash: approveHash,
      });
      toast.promise(approvePending, {
        loading: "Approve is pending...",
        success: "Approve transaction successful",
        error: "approve reverted rejected 🤯",
      });
      await approvePending;
    } catch (err) {
      console.log("🚀 ~ file: swap.ts:130 ~ err:", err);
      toast.error(`An error has occured`);
    }

    const { hash: swapHash } = await executeSwap(route);
    const swapPending = publicClient.waitForTransactionReceipt({
      hash: swapHash,
    });
    toast.promise(swapPending, {
      loading: "Swap transaction is pending...",
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
  fromToken: Token;
  amount: bigint;
  clientAddress: `0x${string}`;
}
