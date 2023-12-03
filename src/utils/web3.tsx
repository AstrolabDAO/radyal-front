import { PrepareSendTransactionArgs } from "@wagmi/core";
import { parseGwei } from "viem/utils";
import { prepareSendTransaction, prepareWriteContract, sendTransaction, writeContract } from "wagmi/actions";
import { erc20Abi } from "abitype/abis";
import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";
import { useContractRead } from "wagmi";
import { currentChain } from "~/context/web3-context";
import { switchNetwork } from "wagmi/actions";

export const swap = async (route: ITransactionRequestWithEstimate) => {
  if (!route) return;
  if (route.maxFeePerGas) delete route.maxFeePerGas;
  if (route.maxPriorityFeePerGas) delete route.maxPriorityFeePerGas;
  const params: PrepareSendTransactionArgs = {
    to: route.to,
    ...route,
    gas: parseGwei("0.00001"),
  };
  console.log(params)
  const { hash } = await send(params);

  const squidExplorer = `https://axelarscan.io/gmp/${hash}`;
  const lifiExplorer = `https://explorer.li.fi/tx/${hash}`
  console.log('squidExplorer: ', squidExplorer);
  console.log('lifiExplorer: ', lifiExplorer);
  console.log('hash: ', hash);
  return hash;
};

export const send = async (r: PrepareSendTransactionArgs) => {
  try {
    return await sendTransaction(await prepareSendTransaction(r));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const writeTx = async (
  functionName: string,
  args: unknown[],
  toAddress: string,
  abi = erc20Abi
) => {
  return await writeContract(
    await prepareWriteTx(args, toAddress, functionName, abi)
  );
}

export const useAllowance = (toAddress: `0x${string}`, address: string) => {
  return useReadTx('allowance', toAddress, [address, toAddress]);
}

export const useReadTx = (
  functionName: any,
  toAddress: `0x${string}`,
  args: unknown[] = [],
  abi = erc20Abi
) => {
  return useContractRead({
    address: toAddress,
    abi,
    args: args as any,
    functionName,
  }).data;
}

export const prepareWriteTx = async (
  args: unknown[],
  toAddress: string,
  functionName: string,
  abi = erc20Abi
) => {
  const { request } = await prepareWriteContract({
    address: toAddress,
    abi,
    functionName,
    args,
  });
  return request;
};


export const approve = async (
  address: string,
  amountInWei: string,
  tokenAddress: string
) => {
  return await writeTx("approve", [address, amountInWei], tokenAddress);
}

export const _switchNetwork = async (chainId: number) => {
  if (currentChain.id !== chainId) await switchNetwork({ chainId });
};