import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";
import { PrepareSendTransactionArgs } from "@wagmi/core";
import { parseGwei } from "viem";
import { executeContract, executeTransaction } from "./transaction";

export const swap = async (tr: ITransactionRequestWithEstimate) => {
  if (!tr) return;
  if (tr.maxFeePerGas) delete tr.maxFeePerGas;
  if (tr.maxPriorityFeePerGas) delete tr.maxPriorityFeePerGas;
  const params: PrepareSendTransactionArgs = {
    ...tr,
    gas: parseGwei("0.00001"),
  };

  const { hash } = await executeTransaction(params);

  console.log("lifiExplorer: ", `https://explorer.li.fi/tx/${hash}`);
  console.log("squidExplorer: ", `https://axelarscan.io/gmp/${hash}`);
  console.log("hash: ", hash);
  return hash;
};

export const approve = async (
  address: string,
  amountInWei: string,
  tokenAddress: string
) => {
  return executeContract("approve", [address, amountInWei], tokenAddress);
};
