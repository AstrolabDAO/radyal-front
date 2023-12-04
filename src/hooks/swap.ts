import { Token } from '~/utils/interfaces.ts';
import { useCallback, useMemo } from "react";
import { useQueryClient } from 'react-query';
import { useReadTx } from '~/hooks/transactions';
import { LifiRequest, generateAndSwap } from '~/utils/lifi';
import { routerByChainId } from '@astrolabs/swapper/dist/src/LiFi';
import { currentChain } from '~/context/web3-context';
import { useAccount } from 'wagmi';

export const useGenerateAndSwap = (fromToken: Token) => {

  const { address } = useAccount();
  const routerAddress = useMemo(() => {
    if (!fromToken) return null;
    return routerByChainId[fromToken?.network.id]
  }, [fromToken])

  const allowance = useAllowance(fromToken?.address, routerAddress, address, fromToken?.network?.id);
  const queryClient = useQueryClient();

  return useCallback((params: LifiRequest) => generateAndSwap({ ...params },allowance,queryClient), [allowance, queryClient])

};

export const useAllowance = (toAddress: `0x${string}`, address: string, owner, chainId: number = currentChain) => {
  return useReadTx("allowance", toAddress, [owner, address], chainId);
};