import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";
import { erc20Abi } from "abitype/abis";
import { ethers } from "ethers";

import { Strategy, Token } from "./interfaces";
import { _switchNetwork, approve, swap } from "./web3";
import {
  getTransactionRequest,
  routerByChainId,
} from "@astrolabs/swapper/dist/src/LiFi";

import { queryClient } from "~/main";
import { QueryClient } from "react-query";

export const generateCallData = async (
  functionName: string,
  fromAddress: string,
  toAddress: string,
  amount: string,
  abi = erc20Abi
) => {
  const contract = new ethers.Contract(fromAddress, abi);
  // todo: dynamic minAmount
  return await contract[`${functionName}`].populateTransaction(
    amount,
    toAddress,
    "0"
  );
};

export const depositCallData = async (
  stratAddress: string,
  address: string,
  toAmount: string
) => {
  return await generateCallData(
    "safeDeposit",
    stratAddress,
    address,
    toAmount,
    StratV5Abi.abi as any
  );
};

export interface LifiRequest {
  address: `0x${string}`;
  fromToken: Token;
  toToken: Token;
  strat: Strategy;
  amount: number;
  estimateOnly?: boolean;
  allowance?: string | number | bigint | boolean;
}

export const generateRequest = async ({
  fromToken,
  toToken,
  strat,
  amount,
  address,
  estimateOnly = false,
}: LifiRequest) => {
  const [inputChainId, outputChainId] = [
    fromToken.network.id,
    toToken.network.id,
  ];
  const [inputToken, outputToken] = [fromToken.address, toToken.address];
  if (inputChainId === outputChainId && inputToken === outputToken) {
    return {
      to: address,
      data: "0x00",
      estimatedExchangeRate: 1, // 1:1 exchange rate
      estimatedOutputWei: amount,
      estimatedOutput: Number(amount) / fromToken.weiPerUnit,
    };
  }

  const customContractCalls = [];

  const amountWei = fromToken.weiPerUnit * amount;

  if (!estimateOnly) {
    console.log("callData amountWei: ", amountWei.toString());
    const { to, data } = await depositCallData(
      strat.address,
      address,
      amountWei.toString()
    );
    customContractCalls.push({ toAddress: to, callData: data });
  }
  const lifiOptions = {
    aggregatorId: ["LIFI"],
    inputChainId: fromToken.network.id,
    input: fromToken.address,
    amountWei: amountWei,
    outputChainId: toToken.network.id,
    output: toToken.address,
    maxSlippage: 50,
    payer: address,
    customContractCalls: customContractCalls.length
      ? customContractCalls
      : undefined,
  };
  console.log("amountWei: ", lifiOptions);

  return getTransactionRequest(lifiOptions);
};

export const generateAndSwap = async (
  { fromToken, toToken, strat, amount, address }: LifiRequest,
  allowance: string | number | bigint | boolean = 0n,
  _queryClient: QueryClient = queryClient
) => {
  await _switchNetwork(fromToken?.network?.id);
  const oldEstimation: number = _queryClient.getQueryData(`estimate-${amount}`);
  let toAmount: number = oldEstimation;

  if (!oldEstimation) {
    const trEstimation = await generateRequest({
      estimateOnly: true,
      fromToken,
      toToken,
      strat,
      amount,
      address,
    });
    console.log("🚀 ~ file: lifi.ts:125 ~ trEstimation:", trEstimation);

    toAmount = Number(trEstimation?.estimatedExchangeRate) * Number(amount);
  }
  const amountWei = BigInt(Math.round(amount * fromToken.weiPerUnit));

  const tr = await generateRequest({
    fromToken,
    toToken,
    strat,
    amount: toAmount,
    address,
  });
  console.log("🚀 ~ file: lifi.ts:137 ~ tr:", tr);

  const approvalAmount = amountWei + amountWei / 500n; // 5%

  if (Number(amountWei.toString()) > Number(allowance.toString()))
    await approve(
      routerByChainId[fromToken.network.id],
      approvalAmount.toString(),
      fromToken.address
    );
  return swap(tr);
};
