import { RouteData, Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";
import { PrepareSendTransactionArgs, writeContract } from "@wagmi/core";
import { parseGwei } from "viem";
import {
  prepareSendTransaction,
  prepareWriteContract,
  sendTransaction,
} from "wagmi/actions";

import { erc20Abi } from "abitype/abis";

const squid = new Squid({ baseUrl: "https://api.0xsquid.com" });

await squid.init();

export enum SquidCallType {
  DEFAULT = 0,
  FULL_TOKEN_BALANCE = 1,
  FULL_NATIVE_BALANCE = 2,
  COLLECT_TOKEN_BALANCE = 3, // unused in hooks
}

export interface ICustomContractCall {
  callType: SquidCallType;
  target: string;
  value: string;
  callData: string;
  payload: {
    tokenAddress: string;
    inputPos: number;
  };
  estimatedGas: string;
}

interface RouteParams {
  fromChain: number;
  fromToken: `0x${string}`;
  fromAmount: string;
}
export const getRoute = async ({
  fromChain,
  fromToken,
  fromAmount,
}: RouteParams) => {
  const slippage = 3.0;
  const enableForecall = false;
  const quoteOnly = false;

  const toChain = 42161;
  const toToken = "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F";
  // receiver = caller here
  const toAddress = "0x7B56288776Cae4260770981b6BcC0f6D011C7b72";

  const stratAddress = "0x1Fe1aa5f581AcD595A362Ff9876eBd9E39Ddf89D";
  // ! don't delete, need it later for approval (useApproval)
  // const squidMulticallAddress = "0x4fd39C9E151e50580779bd04B1f7eCc310079fd3";

  const params = {
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    toAddress,
    slippage,
    enableForecall,
    quoteOnly,
    customContractCalls: [
      generateCustomContractCall("transfer", [stratAddress, "0"], toToken),
    ],
  };

  const { route } = await squid.getRoute(params);
  return route;
};

export const swap = async (route?: RouteData) => {
  //! todo: add approval if needed
  if (!route) route = await getRoute();
  console.log("ROUTE: ", route);
  if (route.transactionRequest.maxFeePerGas)
    delete route.transactionRequest.maxFeePerGas;
  if (route.transactionRequest.maxPriorityFeePerGas)
    delete route.transactionRequest.maxPriorityFeePerGas;

  const param: PrepareSendTransactionArgs = {
    to: route.transactionRequest.targetAddress,
    ...route.transactionRequest,
    gas: parseGwei("0.00001"),
  };

  const { hash } = await send(param);

  const explorer = `https://axelarscan.io/gmp/${hash}`;
  console.log(explorer);
  return explorer;
};

export const encodeData = (
  functionName: string,
  args: unknown[],
  abi = erc20Abi
) => {
  const iface = new ethers.Interface(abi);
  return iface.encodeFunctionData(functionName, args);
};

export const prepareWriteTx = async (
  args: unknown[],
  to: string,
  functionName: string,
  abi = erc20Abi
) => {
  const { request } = await prepareWriteContract({
    address: to,
    abi,
    functionName,
    args,
  });
  return request;
};

export const approve = async (
  routerAddress: string,
  amountInWei: string,
  tokenAddress: string
) => {
  return await writeContract(
    await prepareWriteTx([routerAddress, amountInWei], tokenAddress, "approve")
  );
};

export const generateCustomContractCall = (
  functionName: string,
  args: unknown[],
  toToken: string,
  abi = erc20Abi
): ICustomContractCall => {
  return {
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    target: toToken,
    value: "0",
    callData: encodeData(functionName, args, abi),
    payload: {
      tokenAddress: toToken,
      inputPos: 1,
    },
    estimatedGas: "20000",
  };
};

export const send = async (r: PrepareSendTransactionArgs) => {
  try {
    return await sendTransaction(await prepareSendTransaction(r));
  } catch (e) {
    console.error(e);
    throw e;
  }
};
