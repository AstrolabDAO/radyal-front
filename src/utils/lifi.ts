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
import { estimationQuerySlug } from "./format";
import { ICommonStep } from "@astrolabs/swapper";

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
    amountWei: amountWei - amountWei * 0.02, // because if not 2%, the fromAmount is lower. Why ? I don't know.
    outputChainId: toToken.network.id,
    output: toToken.address,
    maxSlippage: 50,
    payer: address,
    customContractCalls: customContractCalls.length
      ? customContractCalls
      : undefined,
  };
  return getTransactionRequest(lifiOptions);
};

export const generateAndSwap = async (
  { fromToken, toToken, strat, amount, address }: LifiRequest,
  allowance: string | number | bigint | boolean = 0n,
  _queryClient: QueryClient = queryClient
) => {
  await _switchNetwork(fromToken?.network?.id);
  const oldEstimation: {
    estimation: number;
    steps: ICommonStep[];
    request: any;
  } = _queryClient.getQueryData(
    estimationQuerySlug(fromToken, toToken, amount.toString())
  );

  let tr = oldEstimation?.request;

  if (!tr) {
    tr = await generateRequest({
      estimateOnly: true,
      fromToken,
      toToken,
      strat,
      amount,
      address,
    });
  }

  const amountWei = BigInt(Math.round(amount * fromToken.weiPerUnit));

  const approvalAmount = amountWei + amountWei / 500n; // 5%

  if (Number(amountWei.toString()) > Number(allowance.toString())) {
    return [
      tr,
      approve(
        routerByChainId[fromToken.network.id],
        approvalAmount.toString(),
        fromToken.address
      ).then(() => swap(tr)),
    ];
  }
  return [tr, swap(tr)];
};
