import { useContractRead } from "wagmi";
import { erc20Abi } from "abitype/abis";
import { currentChain } from "~/context/web3-context";

export const useReadTx = (
  functionName: any,
  toAddress: `0x${string}`,
  args: unknown[] = [],
  chainId: number = currentChain,
  abi = erc20Abi,
) => {
  return useContractRead({
    address: toAddress,
    chainId,
    abi,
    args: args as any,
    functionName,
  }).data;
};