import { routerByChainId } from "@astrolabs/swapper/dist/src/LiFi";
import { useCallback, useContext, useMemo } from "react";
import { useQueryClient } from "react-query";
import { Client } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { StrategyContext } from "~/context/strategy-context";
import { MinimalSwapContext } from "~/context/swap-context";
import { currentChain } from "~/context/web3-context";
import { useReadTx } from "~/hooks/transactions";
import { executeSwap, getSwapRoute } from "~/services/lifi";
import { tokensIsEqual } from "~/utils";
import { SwapMode } from "~/utils/constants";
import { previewStrategyTokenMove, withdraw } from "~/utils/flows/strategy";
import { amountToEth } from "~/utils/format";
import { LifiRequest, WithdrawRequest } from "~/utils/interfaces.ts";

export const useExecuteSwap = () => {
  const { fromToken } = useContext(MinimalSwapContext);

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

export const useEstimateRoute = () => {
  const { fromToken, toToken, fromValue, swapMode } =
    useContext(MinimalSwapContext);
  const { address } = useAccount();
  const { selectedStrategy } = useContext(StrategyContext);

  const publicClient = usePublicClient({
    chainId: selectedStrategy?.network?.id,
  }) as Client;

  return useCallback(async () => {
    try {
      const interactionEstimation =
        tokensIsEqual(fromToken, toToken) || swapMode === SwapMode.WITHDRAW
          ? await previewStrategyTokenMove(
              {
                strategy: selectedStrategy,
                swapMode,
                value: fromValue,
              },
              publicClient
            )
          : null;

      if (tokensIsEqual(fromToken, toToken)) {
        return interactionEstimation;
      }
      const result = await getSwapRoute({
        address,
        fromToken,
        toToken,
        value: fromValue,
        strat: selectedStrategy,
        swapMode,
      });

      if (!result) throw new Error("route not found from Swapper 🤯");

      const { steps } = result;
      const lastStep = steps[steps.length - 1];

      const estimationStep =
        lastStep.type === "custom" ? steps[steps.length - 2] : lastStep;

      const receiveEstimation = amountToEth(
        estimationStep?.estimate?.toAmount,
        estimationStep?.toToken?.decimals
      );

      return {
        estimation: receiveEstimation,
        steps: !interactionEstimation
          ? steps
          : [...interactionEstimation.steps, ...steps],
        request: result,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [
    address,
    fromToken,
    fromValue,
    publicClient,
    selectedStrategy,
    swapMode,
    toToken,
  ]);
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
  const { fromValue } = useContext(MinimalSwapContext);
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
