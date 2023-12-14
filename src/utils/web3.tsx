import { PrepareSendTransactionArgs } from "@wagmi/core";
import { parseGwei, parseUnits } from "viem/utils";
import {
  prepareSendTransaction,
  prepareWriteContract,
  sendTransaction,
  writeContract,
} from "wagmi/actions";
import { erc20Abi } from "abitype/abis";
import {
  ICommonStep,
  IEstimateParams,
  ITransactionRequestWithEstimate,
} from "@astrolabs/swapper";
import { defaultAbiCoder } from "@ethersproject/abi";
import { currentChain } from "~/context/web3-context";
import { switchNetwork } from "wagmi/actions";
import { BigNumberish } from "ethers";
import StratV5Abi from "@astrolabs/registry/abis/StrategyV5.json";
import { getQuote } from "@astrolabs/swapper/dist/src/LiFi";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { Strategy, WithdrawRequest } from "./interfaces";
import { SwapMode } from "./constants";
import { Client, getContract } from "viem";

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
  abi = StratV5Abi.abi
) => {
  if (!owner) owner = receiver;
  return await writeTx(
    "safeWithdraw",
    [amount, minAmount, receiver, owner],
    contractAddress,
    abi as any
  );
};

export const withdraw = async ({
  amount,
  strategy,
  address,
}: WithdrawRequest) => {
  await _switchNetwork(strategy.network.id);
  return safeWithdraw(strategy.address, amount, address);
};
// input: string,
// amount: BigNumberish,
// receiver: string,
// minShareAmount: BigNumberish = "0",
// params: string,
// stratAddress: string,
// allowance: string | number | bigint | boolean = 0n,
export const swapAndDeposit = async () => {
  const inputChainId = 100;
  const input = "0x4ecaba5870353805a9f068101a40e0f32ed605c6";
  const outputChainId = 100;
  const output = "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83";
  const stratAddress = "0x11c8f790d252f4a49cfbff5766310873898bf5d3";
  const payer = "0x7B56288776Cae4260770981b6BcC0f6D011C7b72";
  const amountWei = "2000000";
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
    await approve(
      "0x78D5ECF1fBd052F7D8914DFBd7e3e5B5cD9aa6BB",
      "50000000",
      input
    );
  }
  return await writeTx(
    "swapSafeDeposit",
    [input, amountWei, payer, "1000000", params],
    stratAddress,
    abi as any
  );
};

interface PreviewStrategyMoveProps {
  strategy: Strategy;
  mode: SwapMode;
  amount: string;
  address: `0x${string}`;
}

export const previewStrategyTokenMove = async (
  { strategy, mode, amount, address }: PreviewStrategyMoveProps,
  publicClient: Client
) => {
  const contract = getContract({
    address: strategy.address,
    abi: StratV5Abi.abi,
    publicClient,
  });

  if (![SwapMode.DEPOSIT, SwapMode.WITHDRAW].includes(mode))
    throw new Error("Invalid mode");

  const fromAmount = parseUnits(amount, strategy.token.decimals);

  const previewAmount = (
    mode === SwapMode.DEPOSIT
      ? await contract.read.previewDeposit([
          parseUnits(amount, strategy.token.decimals),
        ])
      : await contract.read.previewWithdraw([fromAmount])
  ) as bigint;

  console.log("🚀 ~ file: web3.tsx:182 ~ fromAmount:", fromAmount);
  const step = {
    type: "withdraw",
    tool: "radyal",
    fromChain: strategy.network.id,
    toChain: strategy.network.id,
    estimate: {
      fromAmount: fromAmount.toString(),
      toAmount: previewAmount.toString(),
    },
  };
  const estimation = Number(previewAmount) / 10 ** strategy.token.decimals;
  return {
    estimation: estimation,
    steps: [step],
    request: null,
  };
};
