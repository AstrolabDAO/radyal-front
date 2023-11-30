import { PrepareSendTransactionArgs } from "@wagmi/core";
import { parseGwei } from "viem/utils";
import { prepareSendTransaction, prepareWriteContract, sendTransaction, writeContract } from "wagmi/actions";
import { erc20Abi } from "abitype/abis";
import { ITransactionRequestWithEstimate } from "../../../swapperClain/src";

export const swap = async (route: ITransactionRequestWithEstimate) => {
  if (!route) return;
  const param: PrepareSendTransactionArgs = {
    to: route.to,
    ...route,
    gas: parseGwei("0.00001"),
  };

  const { hash } = await send(param);

  const explorer = `https://axelarscan.io/gmp/${hash}`;
  console.log('axelar explorer: ', explorer);
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