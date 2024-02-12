import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5.json";
import {
  ICustomContractCall,
  ITransactionRequestWithEstimate,
  getAllTransactionRequests,
} from "@astrolabs/swapper";
import { PrepareSendTransactionArgs } from "@wagmi/core";
import { erc20Abi } from "abitype/abis";
import { encodeFunctionData, parseGwei } from "viem";
import { tokensIsEqual } from "~/utils";
import { StrategyInteraction } from "~/utils/constants";
import { overrideZeroAddress } from "~/utils/format";
import { SwapperRequest } from "~/utils/interfaces";
import { executeTransaction } from "./transaction";

export const depositCallData = (address: string, toAmount: string) => {
  return generateCallData({
    abi: AgentABI,
    functionName: "safeDeposit",
    args: [toAmount, "0", address],
  });
};

export const approvalCallData = (spender: string, amount: string) => {
  return generateCallData({
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount],
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

export const getSwapRoute = async (params: SwapperRequest) => {
  const { fromToken, toToken, address, amount, interaction, strategy } = params;

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
  const customContractCalls: ICustomContractCall[] = [];
  const slippage = 0.1;
  if (
    interaction === StrategyInteraction.DEPOSIT
    //&&fromToken.network.id !== toToken.network.id
  ) {
    const amountNumber = Number(amount);

    const approval = approvalCallData(
      strategy.address,
      amountNumber.toString()
    );

    customContractCalls.push({
      toAddress: toToken.address,
      callData: approval,
      inputPos: 1,
      gasLimit: "200000",
    });

    const callData = depositCallData(address, amountNumber.toString());

    customContractCalls.push({
      toAddress: strategy.address,
      callData,
      inputPos: 0,
      gasLimit: "250000",
    });
  }

  const quoteOpts: any = {
    aggregatorId: ["SQUID"],
    inputChainId: fromToken.network.id,
    input: overrideZeroAddress(fromToken.address),
    amountWei: amount,
    outputChainId: toToken.network.id,
    output: overrideZeroAddress(toToken.address),
    maxSlippage: slippage * 1000,
    payer: address,
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
  const tr = { ...route };
  if (!tr) return;
  if (tr.maxFeePerGas) delete tr.maxFeePerGas;
  if (tr.maxPriorityFeePerGas) delete tr.maxPriorityFeePerGas;
  const params: PrepareSendTransactionArgs = {
    ...tr,
    //gas: parseGwei("0.00001"),
  };

  console.log("🚀 ~ file: swap.ts:96 ~ executeSwap ~ route:", route);
  const { hash } = await executeTransaction(params);

  console.log("lifiExplorer: ", `https://explorer.li.fi/tx/${hash}`);
  console.log("squidExplorer: ", `https://axelarscan.io/gmp/${hash}`);
  console.log("hash: ", hash);
  return { hash };
};
