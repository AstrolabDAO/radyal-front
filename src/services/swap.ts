import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import {
  ITransactionRequestWithEstimate,
  getAllTransactionRequests,
} from "@astrolabs/swapper";
import { PrepareSendTransactionArgs } from "@wagmi/core";
import { erc20Abi } from "abitype/abis";
import { encodeFunctionData, parseGwei } from "viem";
import { tokensIsEqual } from "~/utils";
import { StrategyInteraction } from "~/utils/constants";
import { overrideZeroAddress } from "~/utils/format";
import { LifiRequest, Token } from "~/utils/interfaces";
import { executeTransaction } from "./transaction";

import toast from "react-hot-toast";
import { PublicClient } from "wagmi";

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
  const { fromToken, toToken, address, amount, action, strategy } = params;

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
    action === StrategyInteraction.DEPOSIT
    //&&fromToken.network.id !== toToken.network.id
  ) {
    const callData = depositCallData(address, amount.toString());

    customContractCalls.push({
      toAddress: strategy.address,
      callData,
    });
  }

  const quoteOpts: any = {
    aggregatorId: ["LIFI" /*, "SQUID"*/],

    inputChainId: fromToken.network.id,
    input: overrideZeroAddress(fromToken.address),
    amountWei: Math.round(Number(amount) - Number(amount) * 0.02), // because if not 2%, the fromAmount is lower. Why ? I don't know.
    outputChainId: toToken.network.id,
    output: overrideZeroAddress(toToken.address),
    maxSlippage: 50,
    payer: address,
    denyBridges: ["amarok"],
    customContractCalls: customContractCalls.length
      ? customContractCalls
      : undefined,
  };

  if (customContractCalls.length) {
    quoteOpts.postHook = [
      {
        toAddress: strategy.address,
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
