import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";
import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";
import { PrepareSendTransactionArgs } from "@wagmi/core";
import { erc20Abi } from "abitype/abis";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { parseGwei } from "viem/utils";
import {
  prepareSendTransaction,
  prepareWriteContract,
  sendTransaction,
  switchNetwork,
  writeContract,
} from "wagmi/actions";
import { currentChain } from "~/context/web3-context";

export const swap = async (tr: ITransactionRequestWithEstimate) => {
  if (!tr) return;
  if (tr.maxFeePerGas) delete tr.maxFeePerGas;
  if (tr.maxPriorityFeePerGas) delete tr.maxPriorityFeePerGas;
  const params: PrepareSendTransactionArgs = {
    ...tr,
    gas: parseGwei("0.00001"),
  };

  const { hash } = await send(params);

  console.log("lifiExplorer: ", `https://explorer.li.fi/tx/${hash}`);
  console.log("squidExplorer: ", `https://axelarscan.io/gmp/${hash}`);
  console.log("hash: ", hash);
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
    await prepareWriteTx(args, toAddress, functionName, abi as any)
  );
};

export const prepareWriteTx = async (
  args: unknown[],
  toAddress: string,
  functionName: string,
  abi = StratV5Abi.abi
) => {
  try {
    const { request } = await prepareWriteContract({
      address: toAddress,
      abi: abi as any,
      functionName,
      args,
    });
    return request;
  } catch (err) {
    // get Wagmi custom error
    if (err instanceof BaseError) {
      const revertError = err.walk(
        (err) => err instanceof ContractFunctionRevertedError
      );
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.errorName ?? "";
        console.error(errorName);
      }
    } else {
      console.error(err);
    }
  }
};

export const approve = async (
  address: string,
  amountInWei: string,
  tokenAddress: string
) => {
  return writeTx("approve", [address, amountInWei], tokenAddress);
};

export const _switchNetwork = async (chainId: number) => {
  if (currentChain.id !== chainId) switchNetwork({ chainId });
};
