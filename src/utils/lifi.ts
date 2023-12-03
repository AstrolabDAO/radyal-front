import { erc20Abi } from "abitype/abis";
import { ethers } from "ethers";
import StratV5Abi from '@astrolabs/registry/abis/StrategyV5.json';

import { getAllTransactionRequests } from "@astrolabs/swapper";
import { approve, swap } from "./web3";
import { routerByChainId } from "@astrolabs/swapper/dist/src/LiFi";
import { currentChain } from "~/context/wallet-context";

export const generateCallData =
  async (functionName: string, fromAddress: string, toAddress: string, amount: string, abi = erc20Abi) => {
    const contract = new ethers.Contract(
      fromAddress,
      abi,
    );
    // todo: dynamic minAmount
    return await contract[`${functionName}`].populateTransaction(amount, toAddress, "0");
  }

export const depositCallData = async (
  stratAddress: string,
  address: string,
  toAmount: string,
) => {
  return await generateCallData('safeDeposit', stratAddress, address, toAmount, StratV5Abi.abi as any);
}

// estimatedOutput
export const generateRequest = async () => {
  const estimateOnly = true;
  const inputChainId = 10;
  const inputToken = '0x0b2c639c533813f4aa9d7837caf62653d097ff85';

  // stratChainId
  const outputChainId = 10;
  // strat underlying token
  const outputToken = '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83';
  const stratAddress = '0x11C8f790d252F4A49cFBFf5766310873898BF5D3';

  // targetAmount to receive 6 === decimals of the token
  const toAmount = ethers.parseUnits("1", 6).toString();

  // payer
  const address = '0x7B56288776Cae4260770981b6BcC0f6D011C7b72';

  const customContractCalls = [];

  if (!estimateOnly) {
    const { to, data } = await depositCallData(stratAddress, address, toAmount);
    customContractCalls.push({ toAddress: to, callData: data })
  }

  const tr = await getAllTransactionRequests({
    aggregatorId: ['LIFI'],
    inputChainId,
    input: inputToken,
    amountWei: toAmount,
    outputChainId,
    output: outputToken,
    maxSlippage: 2_000,
    payer: address,
    customContractCalls: customContractCalls.length ? customContractCalls : undefined
  });
  console.log('transaction request response: ', tr);
  return tr;
}

export const generateAndSwap = async (
  inputToken: string,
  amount: number|string,
  decimals: number,
) => {
  const tr = await generateRequest();
  if (typeof amount === 'string') amount = parseFloat(amount);
  const approvalAmount = ethers.parseUnits((amount * 1.2).toString(), decimals).toString();
  await approve(routerByChainId[currentChain], approvalAmount, inputToken);
  await swap(tr[0]);
  return tr;
}