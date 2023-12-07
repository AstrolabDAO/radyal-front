import { PrepareSendTransactionArgs } from "@wagmi/core";
import { parseGwei } from "viem/utils";
import {
  prepareSendTransaction,
  prepareWriteContract,
  sendTransaction,
  writeContract,
} from "wagmi/actions";
import { erc20Abi } from "abitype/abis";
import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";
import { currentChain } from "~/context/web3-context";
import { switchNetwork } from "wagmi/actions";
import { BigNumberish, ethers } from "ethers";
import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";

export const swap = async (tr: ITransactionRequestWithEstimate) => {
  if (!tr) return;
  if (tr.maxFeePerGas) delete tr.maxFeePerGas;
  if (tr.maxPriorityFeePerGas) delete tr.maxPriorityFeePerGas;
  const params: PrepareSendTransactionArgs = {
    ...tr,
    gas: parseGwei("0.00001"),
  };
  console.log(params);
  const { hash } = await send(params);

  console.log("lifiExplorer: ", `https://explorer.li.fi/tx/${hash}`);
  //   : console.log("squidExplorer: ", `https://axelarscan.io/gmp/${hash}`);
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
    await prepareWriteTx(args, toAddress, functionName, abi)
  );
};

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
};

export const _switchNetwork = async (chainId: number) => {
  if (currentChain.id !== chainId) await switchNetwork({ chainId });
};

export const safeWithdraw = async (
  contractAddress: string,
  amount: BigNumberish,
  receiver: string,
  owner?: string,
  minAmount = "0",
  abi = StratV5Abi.abi
) => {
  if (!owner) owner = receiver;
  return await writeTx(
    "safeWithdraw",
    [amount, minAmount,receiver, owner],
    contractAddress,
    abi as any
  );
};

export const withdraw = async () => {
  // todo: make it dynamic
  const address = '0x7B56288776Cae4260770981b6BcC0f6D011C7b72';
  const amount = ethers.parseUnits('3.30', 6);
  const contractAddress = '0x11C8f790d252F4A49cFBFf5766310873898BF5D3';
  const chainId = 100;
  await _switchNetwork(chainId);
  const res = await safeWithdraw(contractAddress, amount, address);
  return res;
}