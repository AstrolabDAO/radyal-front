import { erc20Abi } from "abitype/abis";
import { ethers } from "ethers";
import { getAllTransactionRequests }  from "@astrolabs/swapper";
import { swap } from "./web3";

export const generateCallData =
  async (functionName: string, fromAddress: string, toAddress: string, amount: string, abi = erc20Abi) => {
    const contract = new ethers.Contract(
      fromAddress,
      abi,
    );
    return await contract[`${functionName}`].populateTransaction(toAddress, amount);
  }

export const getLifitransactionRequest = async () => {
  const inputChainId = 250;
  const inputToken = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83';

  const outputChainId = 42161;
  const outputToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';

  const toAmount = ethers.parseUnits("2", 6).toString();

  // payer
  const address = '0x7B56288776Cae4260770981b6BcC0f6D011C7b72';
  const stratAddress = '0x1Fe1aa5f581AcD595A362Ff9876eBd9E39Ddf89D';

  const callData = await generateCallData('transfer', outputToken, stratAddress, toAmount);

  const tr = await getAllTransactionRequests({
    inputChainId,
    input: inputToken,
    amountWei: toAmount,
    outputChainId,
    output: outputToken,
    maxSlippage: 2_000,
    payer: address,
    customContractCalls: [{
      toAddress: callData.to,
      callData: callData.data,
    }],
  });
  console.log('transaction request response: ', tr);
  return await swap(tr[0])
}