import { PrepareSendTransactionArgs } from "@wagmi/core";
import { prepareSendTransaction, sendTransaction } from "wagmi/actions";
import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";
import { erc20Abi } from "abitype/abis";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { prepareWriteContract } from "wagmi/actions";
import { writeContract } from "@wagmi/core";
export const executeTransaction = async (opts: PrepareSendTransactionArgs) => {
  try {
    const prepare = await prepareSendTransaction(opts);
    return await sendTransaction(prepare);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const executeContract = async (
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
