import { tokensIsEqual } from "~/utils";
import { LifiRequest } from "~/utils/interfaces";
import { encodeData } from "./squid";
import { getAllTransactionRequests } from "@astrolabs/swapper";
import { abi as StratV5Abi } from "@astrolabs/registry/abis/StrategyV5.json";
import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import { SwapMode } from "~/utils/constants";
import { overrideZeroAddress } from "~/utils/format";
import { encodeFunctionData } from "viem";

export const depositCallData = async (address: string, toAmount: string) => {
  return encodeFunctionData({
    abi: AgentABI,
    functionName: "safeDeposit",
    args: [toAmount, "0", address],
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
  const callData = await depositCallData(address, amount.toString());
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
  console.log("🚀 ~ file: swap.ts:58 ~ getSwapRoute ~ quoteOpts:", quoteOpts);

  return getAllTransactionRequests(quoteOpts);
};
