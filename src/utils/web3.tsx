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
import { defaultAbiCoder } from "@ethersproject/abi";
import { currentChain } from "~/context/web3-context";
import { switchNetwork } from "wagmi/actions";
import { BigNumberish, ethers } from "ethers";
import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";
import { getQuote } from "@astrolabs/swapper/dist/src/LiFi";
import { BaseError, ContractFunctionRevertedError } from "viem";

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
  } catch(err) {
    // get Wagmi custom error
    if (err instanceof BaseError) {
      const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.errorName ?? ''
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
  // todo: minAmount from preview withdraw
  minAmount = "0",
  abi = StratV5Abi.abi,
) => {
  if (!owner) owner = receiver;
  return await writeTx(
    "safeWithdraw",
    [amount, minAmount, receiver, owner],
    contractAddress,
    abi as any
  );
};

export const withdraw = async () => {
  // todo: make it dynamic
  const address = '0x7B56288776Cae4260770981b6BcC0f6D011C7b72';
  const amount = ethers.parseUnits('0.30', 6);
  const contractAddress = '0x11C8f790d252F4A49cFBFf5766310873898BF5D3';
  const chainId = 100;
  await _switchNetwork(chainId);
  const res = await safeWithdraw(contractAddress, amount, address);
  console.log(res)
  return res;
}

// todo: wait for smart contract to be fixed
export const swapAndDeposit = async () => {
  const inputChainId = 100;
  const input = "0x4ecaba5870353805a9f068101a40e0f32ed605c6";
  const outputChainId = 100;
  const output = '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83';
  const stratAddress = '0x11c8f790d252f4a49cfbff5766310873898bf5d3';
  const payer = '0x7B56288776Cae4260770981b6BcC0f6D011C7b72';
  const amountWei = '2000000';
  const abi = StratV5Abi.abi;
  await _switchNetwork(inputChainId);

  const { transactionRequest } = await getQuote({
    aggregatorId: ["LIFI"],
    inputChainId,
    input,
    outputChainId,
    output,
    amountWei,
    maxSlippage: 500,
    payer,
  });
  console.log(transactionRequest);
  const params = defaultAbiCoder.encode(
    ["address", "uint256", "bytes"],
    [transactionRequest.to, amountWei, transactionRequest.data]
  );
  console.log(params);
  const allowance = 0n;
  if (Number(amountWei.toString()) > Number(allowance.toString())) {
    const approvalAmount = amountWei + amountWei / 500n; // 5%
    await approve('0x78D5ECF1fBd052F7D8914DFBd7e3e5B5cD9aa6BB', "50000000", input);
  }
  return await writeTx(
    'swapSafeDeposit',
    [input, amountWei, payer, "1000000", params],
    stratAddress,
    abi as any
  );
};
