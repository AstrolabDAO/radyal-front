import { ethers } from "ethers";
import { erc20Abi } from "abitype/abis";
import { getTransactionRequest } from '../../../swapperClain/src/Squid'
import { swap } from "./web3";
import StratV5Abi from '@astrolabs/registry/abis/StrategyV5.json';


export enum SquidCallType {
  DEFAULT = 0,
  FULL_TOKEN_BALANCE = 1,
  FULL_NATIVE_BALANCE = 2,
  COLLECT_TOKEN_BALANCE = 3, // unused in hooks
}

export interface ICustomContractCall {
  callType: SquidCallType;
  target: string;
  value: string;
  callData: string;
  payload: {
    tokenAddress: string;
    inputPos: number;
  };
  estimatedGas: string;
}
/*
interface RouteParams {
  fromChain: number;
  fromAddress: `0x${string}`;
  toChain: number;
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  toAddress: `0x${string}`;
  fromAmount: string;
}*/

export const encodeData = (
  functionName: string,
  args: unknown[],
  abi = erc20Abi
) => {
  const iface = new ethers.Interface(abi);
  return iface.encodeFunctionData(functionName, args);
};

// export const generateLifiCallData =
//   async (stratAddress: string, abi = erc20Abi, minAmount: string, fromAddress: string) => {
//     const contract = new ethers.Contract(
//       fromAddress,
//       abi,
//     );
//     return await contract.transfer.populateTransaction(stratAddress, minAmount);
//   }

// export const getAllowance = async (fromToken: string, abi = erc20Abi) => {
//   const publicClient = currentProvider[1] as PublicClient;
//   await publicClient.readContract({
//     address: fromToken,
//     functionName: 'allowance',
//     abi,
//   })
// }

export const getSquidTransactionRequest = async () => {
  const inputChainId = 250;
  const outputChainId = 42161;
  const amountWei = ethers.parseUnits("1.3", 18).toString();
  // WTFM
  const inputToken = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83';
  // USDC
  const outputToken = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
  const address = '0x7B56288776Cae4260770981b6BcC0f6D011C7b72';
  const stratAddress = '0x1Fe1aa5f581AcD595A362Ff9876eBd9E39Ddf89D';
  const tr = await getTransactionRequest({
    // swapper config
    aggregatorId: 'SQUID',
    // from
    inputChainId,
    input: inputToken,
    amountWei: amountWei,
    // to
    outputChainId,
    output: outputToken,
    maxSlippage: 2_000,
    // testPayer: address,
    payer: address,
    customContractCalls: [
      generateSquidContractCall("transfer", [stratAddress, "0"], outputToken),
    ]
  });
  console.log('squid transaction request response: ', tr);
  await swap(tr as RouteData)
  return tr;
}

export const getRoute = async ({
  fromAddress,
  fromChain,
  fromToken,
  fromAmount,
  toChain,
  toToken,
  toAddress,
}: RouteParams) => {
  const baseUrl = "https://v2.api.squidrouter.com"; // "https://api.0xsquid.com"
  const squid = new Squid({ baseUrl, integratorId: "radyal-astrolab-sdk" });

  await squid.init();
  const slippage = 3.0;
  const enableForecall = false;
  const quoteOnly = false;

  const stratAddress = "0x1Fe1aa5f581AcD595A362Ff9876eBd9E39Ddf89D";

  const nullAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const zeroAddressRegex = /^0x(0)+(1010)?$/i;

  // Allowance & approval part (to test)
  // ! don't delete, need it later for approval (useApproval)
  // const squidMulticallAddress = "0x4fd39C9E151e50580779bd04B1f7eCc310079fd3";
  // await increaseAllowance(userAddress, fromAmount, fromToken);
  // switchNetworkIfNeeded(strat.chainId);
  // await approve(fromToken, fromAmount, squidMulticallAddress);
  // switchNetworkIfNeeded(fromChain);

  const params = {
    fromAddress,
    fromChain: fromChain.toString(),
    fromToken: zeroAddressRegex.test(fromToken) ? nullAddress : fromToken,
    fromAmount,
    toChain: toChain.toString(),
    toToken: zeroAddressRegex.test(toToken) ? nullAddress : toToken,

    toAddress,
    slippage,
    enableForecall,
    quoteOnly,
    slippageConfig: {
      autoMode: 1,
    },
    customContractCalls: [
      generateSquidContractCall("transfer", [stratAddress, "0"], toToken),
    ],
  };

  const { route } = await squid.getRoute(params);
  console.log(route)
  return route;
};

export const depositCallData = async (
  stratAddress: string,
  address: string,
  toAmount: string,
) => {
  return await generateSquidContractCall(
    "safeDeposit",
    [toAmount, stratAddress, "0"],
    toAmount,
    StratV5Abi.abi as any
  );
}

export const generateSquidContractCall = (
  functionName: string,
  args: unknown[],
  toToken: string,
  abi = erc20Abi
): ICustomContractCall => {
  return {
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    target: toToken,
    value: "0",
    callData: encodeData(functionName, args, abi),
    payload: {
      tokenAddress: toToken,
      inputPos: 1,
    },
    estimatedGas: "20000",
  };
};