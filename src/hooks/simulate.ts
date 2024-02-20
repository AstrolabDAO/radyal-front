import { erc20Abi } from 'abitype/abis';
import { usePublicClient } from 'wagmi';
import { WAGMI_CONFIG } from '~/utils/setup-web3modal';

export const SimulateTx = async (
  functionName: string,
  address:`0x${string}`,
  chainId=1,
  abi=erc20Abi) => {
  const publicClient = usePublicClient({ config: WAGMI_CONFIG, chainId });
  return await publicClient.simulateContract({
    functionName: functionName as any,
    address,
    abi
  } as any);
}
