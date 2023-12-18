import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";
import { erc20Abi } from "abitype/abis";
import { ethers } from "ethers";

import { LifiRequest, SwapEstimation } from "./interfaces";
import { _switchNetwork, approve, swap } from "./web3";
import {
  getAllTransactionRequests,
} from "@astrolabs/swapper/dist/src/";

import { queryClient } from "~/main";
import { QueryClient } from "react-query";
import { cacheHash } from "./format";
import { SwapMode } from "./constants";
import { encodeData } from "./squid";
import { routerByChainId } from "@astrolabs/swapper/dist/src/LiFi";

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

export const getSwapRoute = async ({
  address,
  fromToken,
  toToken,
  value,
  strat,
  swapMode = SwapMode.DEPOSIT,
}: LifiRequest) => {
  const amount = BigInt(Math.round(value * fromToken.weiPerUnit));

  console.log('generateRequest', fromToken, toToken, strat, amount, address);
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

  if (swapMode === SwapMode.DEPOSIT) {
    const { to, data } = await depositCallData(
      strat.address,
      address,
      amount.toString()
    );

    customContractCalls.push({ toAddress: to, callData: data });
  }
  const lifiOptions = {
    aggregatorId: ["LIFI", "SQUID"],
    inputChainId: fromToken.network.id,
    input: fromToken.address,
    amountWei: Math.round(Number(amount) - Number(amount) * 0.02), // because if not 2%, the fromAmount is lower. Why ? I don't know.
    outputChainId: toToken.network.id,
    output: toToken.address,
    maxSlippage: 50,
    payer: address,
    denyExchanges: ["1inch"],
    customContractCalls: customContractCalls.length
      ? customContractCalls
      : undefined,
    postHook: [{
      callData: encodeData("transfer", [strat.address, "0"], erc20Abi),
    }]
  };
  const res = await getAllTransactionRequests(lifiOptions);
  console.log(res);
  return res;
};

export const executeSwap = async (
  opts: LifiRequest,
  allowance: bigint = 0n,
  _queryClient: QueryClient = queryClient
) => {
  const { fromToken, toToken, value, swapMode } = opts;
  await _switchNetwork(fromToken?.network?.id);

  const amount = BigInt(Math.round(value * fromToken.weiPerUnit));
  const oldEstimation: SwapEstimation = _queryClient.getQueryData(
    cacheHash("estimate", swapMode, fromToken, toToken, value)
  );

  let tr = oldEstimation?.request;

  if (!tr) {
    tr = await getSwapRoute(opts);
    // tr = await generateRequest({
    //   estimateOnly: false,
    //   fromToken,
    //   toToken,
    //   strat,
    //   amount,
    //   address,
    // });
  }

  const approvalAmount = amount + amount / 500n; // 5%

  if (amount > allowance) {
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
