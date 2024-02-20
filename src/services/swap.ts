import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5.json";
import {
  ICustomContractCall,
  getAllTransactionRequests,
} from "@astrolabs/swapper";
import { erc20Abi } from "abitype/abis";
import toast from "react-hot-toast";
import { PublicClient, encodeFunctionData } from "viem";
import { getAccount } from "wagmi/actions";
import { Operation } from "~/model/operation";
import { Store } from "~/store";
import { tokensIsEqual } from "~/utils";
import { StrategyInteraction } from "~/utils/constants";
import { overrideZeroAddress } from "~/utils/format";
import { getSwapperStore } from "./swapper";
import { executeTransaction } from "./transaction";

export const depositCallData = (address: string, toAmount: string) => {
  return generateCallData({
    abi: AgentABI,
    functionName: "safeDeposit",
    args: [toAmount, "0", address],
  });
};

export const approvalCallData = (spender: string, amount: string) => {
  return generateCallData({
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount],
  });
};

export const generateCallData = ({
  functionName,
  args,
  abi = erc20Abi,
}: GenerateCallDataProps) => {
  return encodeFunctionData({
    abi,
    functionName,
    args,
  });
};

export const getSwapRoute = async (_value?: number) => {
  const { address } = getAccount();
  const store = getSwapperStore();
  const interaction = store.interaction;
  const { from: basefrom, to: baseTo, value } = store[interaction];
  const from = "asset" in basefrom ? basefrom.asset : basefrom;
  const to = "asset" in baseTo ? baseTo.asset : baseTo;
  const amount = BigInt(Math.round((_value ?? value) * from.weiPerUnit));
  if (tokensIsEqual(from, to)) {
    return [
      {
        to: address,
        data: "0x00",
        estimatedExchangeRate: 1, // 1:1 exchange rate
        estimatedOutputWei: amount,
        estimatedOutput: Number(amount) / from.weiPerUnit,
      },
    ];
  }
  const customContractCalls: ICustomContractCall[] = [];
  const slippage = 0.1;
  if (interaction === StrategyInteraction.DEPOSIT) {
    const amountNumber = Number(amount);

    const approval = approvalCallData(baseTo.address, amountNumber.toString());

    customContractCalls.push({
      toAddress: to.address,
      callData: approval,
      inputPos: 1,
      gasLimit: "200000",
    });

    const callData = depositCallData(address, amountNumber.toString());

    customContractCalls.push({
      toAddress: baseTo.address,
      callData,
      inputPos: 0,
      gasLimit: "250000",
    });
  }

  const quoteOpts: any = {
    aggregatorId: ["SQUID"],
    inputChainId: from.network.id,
    input: overrideZeroAddress(from.address),
    amountWei: amount,
    outputChainId: to.network.id,
    output: overrideZeroAddress(to.address),
    maxSlippage: slippage * 1000,
    payer: address,
    customContractCalls: customContractCalls.length
      ? customContractCalls
      : undefined,
  };

  if (customContractCalls.length) {
    quoteOpts.postHook = [
      {
        toAddress: baseTo.address,
        callData: customContractCalls[0].callData,
      },
    ];
  }

  return getAllTransactionRequests(quoteOpts);
};

interface GenerateCallDataProps {
  functionName: any;
  abi: any;
  args: any[];
}

export const executeSwap = async (
  operation: Operation,
  _publicClient: PublicClient
) => {
  const tr = { ...operation.estimation.request };
  if (!tr) return;
  if (tr.maxFeePerGas) delete tr.maxFeePerGas;
  if (tr.maxPriorityFeePerGas) delete tr.maxPriorityFeePerGas;

  const { hash } = await executeTransaction(tr);

  console.log("lifiExplorer: ", `https://explorer.li.fi/tx/${hash}`);
  console.log("squidExplorer: ", `https://axelarscan.io/gmp/${hash}`);

  const swapPending = _publicClient.waitForTransactionReceipt({
    hash: hash,
  });
  toast.promise(swapPending, {
    loading: "Swap transaction is pending...",
    success: "Swap transaction successful",
    error: "Swap reverted rejected 🤯",
  });

  Store.dispatch({
    type: "operations/emmitStep",
    payload: {
      operationId: operation.id,
      label: "swap-pending",
      promise: swapPending,
    },
  });
  await swapPending;
  return hash;
};
