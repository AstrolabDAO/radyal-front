import { erc20Abi } from "abitype/abis";
import { ethers } from "ethers";
import StratV5Abi from '@astrolabs/registry/abis/StrategyV5.json';

import { routerByChainId } from "../../../swapperClain/src/LiFi";
import { getAllTransactionRequests } from "../../../swapperClain/src";
import { approve, swap } from "./web3";

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

export const generateRequest = async () => {
  const inputChainId = 10;
  const inputToken = '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58';

  // stratChainId
  const outputChainId = 100;
  // strat underlying token
  const outputToken = '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83';

  // targetAmount to receive 6 === decimals of the token
  const toAmount = ethers.parseUnits("2", 6).toString();
  // const toAmountAllowance = ethers.parseUnits("20", 6).toString();

  // payer
  const address = '0x7B56288776Cae4260770981b6BcC0f6D011C7b72';
  const stratAddress = '0x11C8f790d252F4A49cFBFf5766310873898BF5D3';

  const { to, data } = await depositCallData(stratAddress, address, toAmount);

  const tr = await getAllTransactionRequests({
    inputChainId,
    input: inputToken,
    amountWei: toAmount,
    outputChainId,
    output: outputToken,
    maxSlippage: 2_000,
    payer: address,
    customContractCalls: [{
      toAddress: to,
      callData: data,
    }]
  });
  console.log('transaction request response: ', tr);
  return tr;
}

export const generateAndSwap = async () => {
  const tr = await generateRequest();
  // todo: inputChainId = currentNetwork, toAmount = amountToReceive, inputToken = target token to swap
  await approve(routerByChainId[inputChainId], toAmountAllowance, inputToken);
  await swap(tr[0]);
  return tr;
}