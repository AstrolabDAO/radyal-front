import { ethers } from "ethers";
import { erc20Abi } from "abitype/abis";
import { _switchNetwork, approve, swap } from "./web3";
import { currentChain } from "~/context/web3-context";
import { getTransactionRequest } from "@astrolabs/swapper/dist/src/Squid";
import { ISwapperParams } from "@astrolabs/swapper/dist/src/types";

export const encodeData = (
  functionName: string,
  args: unknown[],
  abi = erc20Abi
) => {
  const iface = new ethers.Interface(abi);
  return iface.encodeFunctionData(functionName, args);
};

export const getRoute = async () => {
  const slippage = 3.0;
  const fromChain = 137;
  const fromToken = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
  const fromAmount = ethers.parseUnits("1.4", 6).toString();
  const toChain = 42161;
  const toToken = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
  // receiver = caller here
  const toAddress = "0x7B56288776Cae4260770981b6BcC0f6D011C7b72";
  const stratAddress = "0x1Fe1aa5f581AcD595A362Ff9876eBd9E39Ddf89D";

  const params: ISwapperParams = {
    inputChainId: fromChain,
    input: fromToken,
    amountWei: fromAmount,
    outputChainId: toChain,
    output: toToken,
    payer: toAddress,
    maxSlippage: slippage,
    customContractCalls: [{
      callData: encodeData("transfer", [stratAddress, "0"], erc20Abi),
    }]
  };

  return await getTransactionRequest(params);
};

export const routeAndSwap = async () => {
  _switchNetwork(currentChain.id)
  const tr = await getRoute();
  await approve(tr.to, tr.steps[0].fromToken.fromAmount, tr.steps[0].fromToken.address)
  await swap(tr);
}
