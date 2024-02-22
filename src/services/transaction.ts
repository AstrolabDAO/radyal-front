import { erc20Abi } from "abitype/abis";
import { BaseError, ContractFunctionRevertedError } from "viem";

import { writeContract } from "@wagmi/core";
import { estimateGas, sendTransaction } from "wagmi/actions";
import { getWagmiConfig } from "./web3";

export const executeTransaction = async (opts) => {
  try {
    const config = getWagmiConfig();
    //const estimate = await estimateGas(config, opts);
    return sendTransaction(config, opts);
    //const prepare = await estimateGas(opts);
    //return await sendTransac(opts);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const executeContract = async ({ abi = erc20Abi, ...args }: TxArgs) => {
  return writeContract(getWagmiConfig(), {
    ...args,
    abi,
  });
  //return await writeContract(await prepareWriteTx({ abi, ...args }));
};

/*
export const prepareWriteTx = async ({ abi = erc20Abi, ...args }: TxArgs) => {
  try {
    const { request } = await prepareWriteContract({ abi, ...args });

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
*/

export const approve = async ({
  spender,
  address,
  amount,
  chainId,
}: ApproveArgs) => {
  return executeContract({
    functionName: "approve",
    args: [spender, amount],
    address: address,
    chainId,
  });
};

export interface BaseTxArgs {
  address: `0x${string}`;
  chainId: number;
  args: unknown[];
  abi?: any;
  enabled?: boolean;
}

export interface TxArgs extends BaseTxArgs {
  functionName: any;
}

interface ApproveArgs {
  address: `0x${string}`;
  spender: `0x${string}`;
  amount: bigint;
  chainId: number;
}
