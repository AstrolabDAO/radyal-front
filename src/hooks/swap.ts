import { routerByChainId } from "@astrolabs/swapper/dist/src/LiFi";
import { useCallback, useContext, useMemo } from "react";
import { useQueryClient } from "react-query";
import { Client } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { currentChain } from "~/context/web3-context";
import { useReadTx } from "~/hooks/transactions";
import { SwapMode } from "~/utils/constants";
import { LifiRequest, Token, WithdrawRequest } from "~/utils/interfaces.ts";
import { executeSwap, getSwapRoute } from "~/utils/lifi";
import { previewStrategyTokenMove, withdraw } from "~/utils/web3";

export const useExecuteSwap = (fromToken: Token) => {
  const { address } = useAccount();
  const routerAddress = useMemo(() => {
    if (!fromToken) return null;
    return routerByChainId[fromToken?.network.id];
  }, [fromToken]);

  const allowance = useAllowance(
    fromToken?.address,
    routerAddress,
    address,
    fromToken?.network?.id
  );
  const queryClient = useQueryClient();

  return useCallback(
    (params: LifiRequest) =>
      executeSwap({ address, ...params }, allowance as bigint, queryClient),
    [allowance, queryClient, address]
  );
};

export const useGetSwapRoute = () => {
  const { address } = useAccount();
  return useCallback(
    (params: LifiRequest) => getSwapRoute({ address, ...params }),
    [address]
  );
};

export const useAllowance = (
  toAddress: `0x${string}`,
  address: string,
  owner,
  chainId: number = currentChain
) => {
  return useReadTx("allowance", toAddress, [owner, address], chainId);
};

export const useWithdraw = () => {
  const { address } = useAccount();
  return useCallback(
    (params: WithdrawRequest) => withdraw({ address, ...params }),
    [address]
  );
};

export const usePreviewStrategyTokenMove = (mode: SwapMode) => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { fromValue } = useContext(SwapContext);
  const publicClient = usePublicClient({
    chainId: selectedStrategy.id,
  }) as Client;

  return useCallback(() => {
    return previewStrategyTokenMove(
      {
        strategy: selectedStrategy,
        mode,
        value: fromValue,
      },
      publicClient
    );
  }, [fromValue, mode, publicClient, selectedStrategy]);
};
