import { erc20Abi } from "abitype/abis";
import { useCallback } from "react";
import { useContractRead, useNetwork } from "wagmi";
import { switchNetwork } from "wagmi/actions";

export const useSwitchNetwork = (chainId: number) => {
  const currentNetwork = useNetwork();
  return useCallback(async () => {
    if (currentNetwork.chain.id !== chainId) switchNetwork({ chainId });
  }, [chainId, currentNetwork.chain.id]);
};

export const useReadTx = (
  functionName: any,
  toAddress: `0x${string}`,
  args: unknown[] = [],
  chainId,
  abi = erc20Abi
) => {
  return useContractRead({
    address: toAddress,
    chainId,
    abi,
    args: args as any,
    functionName,
  }).data;
};
