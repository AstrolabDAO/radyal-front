import { erc20Abi } from 'abitype/abis';
import { usePublicClient } from 'wagmi';

export const SimulateTx = async (
  functionName: string,
  address:`0x${string}`,
  chainId=1,
  abi=erc20Abi) => {
  const publicClient = usePublicClient({ chainId });
  return await publicClient.simulateContract({
    functionName: functionName as any,
    address,
    abi
  });
}