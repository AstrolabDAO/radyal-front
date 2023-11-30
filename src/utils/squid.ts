import { Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";
import { PrepareSendTransactionArgs, writeContract } from "@wagmi/core";
import { parseGwei } from "viem";
import { erc20Abi } from "abitype/abis";

import {
  prepareSendTransaction,
  prepareWriteContract,
  sendTransaction,
  switchNetwork,
} from "wagmi/actions";
import { currentChain } from "~/context/wallet-context";

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
  fromAddress: `0x${string}`;
  toChain: number;
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  toAddress: `0x${string}`;
  fromAmount: string;
}

export const getRoute = async ({
  fromAddress,
  fromChain,
  fromToken,
  fromAmount,
  toChain,
  toToken,
  toAddress,
}: RouteParams) => {
  const baseUrl = "https://v2.api.squidrouter.com"; // "https://api.0xsquid.com"
  const squid = new Squid({ baseUrl, integratorId: "radyal-astrolab-sdk" });

  await squid.init();
  const slippage = 3.0;
  const enableForecall = false;
  const quoteOnly = false;

  const stratAddress = "0x1Fe1aa5f581AcD595A362Ff9876eBd9E39Ddf89D";

  const nullAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const zeroAddressRegex = /^0x(0)*[0-9a-fA-F]*$/i;

  // Allowance & approval part (to test)
  // ! don't delete, need it later for approval (useApproval)
  // const squidMulticallAddress = "0x4fd39C9E151e50580779bd04B1f7eCc310079fd3";
  // await increaseAllowance(userAddress, fromAmount, fromToken);
  // switchNetworkIfNeeded(strat.chainId);
  // await approve(fromToken, fromAmount, squidMulticallAddress);
  // switchNetworkIfNeeded(fromChain);

  const params = {
    fromAddress,
    fromChain: fromChain.toString(),
    fromToken: zeroAddressRegex.test(fromToken) ? nullAddress : fromToken,
    fromAmount,
    toChain: toChain.toString(),
    toToken: zeroAddressRegex.test(toToken) ? nullAddress : toToken,
    toAddress,
    slippage,
    enableForecall,
    quoteOnly,
    slippageConfig: {
      autoMode: 1,
    },
    customContractCalls: [
      generateCustomContractCall("transfer", [stratAddress, "0"], toToken),
    ],
  };

  const { route } = await squid.getRoute(params);
  return route;
};

export const swap = async (route) => {
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

export const getDeadline = (minutes = 30) => {
  const now = new Date();
  return now.setMinutes(now.getMinutes() + minutes);
};

// safeDeposit([amountWei, receiver, 0, getDeadline()], stratAddress, stratAbi);

export const safeDeposit = async (
  args: unknown[],
  stratAddress: string,
  abi = erc20Abi
) => {
  return await writeContract(
    await prepareWriteTx(args, stratAddress, "safeDeposit", abi)
  );
};

// safeWithdraw([amountWei, 0, getDeadline(), receiver, receiver], stratAddress, stratAbi);

export const safeWithdraw = async (
  args: unknown[],
  stratAddress: string,
  abi = erc20Abi
) => {
  return await writeContract(
    await prepareWriteTx(args, stratAddress, "safeWithdraw", abi)
  );
};

export const switchNetworkIfNeeded = async (chainId: number) => {
  if (currentChain.id !== chainId) await switchNetwork({ chainId });
};

export const increaseAllowance =
  // spender = routerAddress
  async (
    spender: string,
    amountInWei: string,
    tokenAddress: string,
    functionName = "increaseAllowance"
  ) => {
    return await writeContract(
      await prepareWriteTx([spender, amountInWei], tokenAddress, functionName)
    );
  };
