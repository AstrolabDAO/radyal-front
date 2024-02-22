import { erc20Abi } from "abitype/abis";
import { usePublicClient } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { getWagmiConfig } from "~/services/web3";

export const SimulateTx = async (
  functionName: string,
  address: `0x${string}`,
  chainId: number,
  abi: any,
  args: any[]
) => {
  const publicClient = getPublicClient(getWagmiConfig(), { chainId });
  return await publicClient.simulateContract({
    functionName: functionName,
    address,
    abi: abi as any,
    args: [],
  });
};
