import { useCallback, useContext, useMemo } from "react";
import { Client } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { StrategyContext } from "~/context/strategy-context";
import { MinimalSwapContext } from "~/context/swap-context";
import { currentChain } from "~/context/web3-context";
import { useReadTx } from "~/hooks/transactions";
import { tokensIsEqual } from "~/utils";
import { SwapMode } from "~/utils/constants";
import { previewStrategyTokenMove, withdraw } from "~/utils/flows/strategy";
import { amountToEth } from "~/utils/format";
import { WithdrawRequest } from "~/utils/interfaces.ts";
import { useLiFiExecuteSwap } from "./lifi";

import { getSwapRoute } from "~/services/swap";

export const useExecuteSwap = () => {
  const lifiExecuteSwap = useLiFiExecuteSwap();

  return useCallback(() => lifiExecuteSwap(), [lifiExecuteSwap]);
};

export const useEstimateRoute = () => {
  const { fromToken, toToken, fromValue, swapMode } =
    useContext(MinimalSwapContext);
  const { selectedStrategy } = useContext(StrategyContext);

  const publicClient = usePublicClient({
    chainId: selectedStrategy?.network?.id,
  }) as Client;

  const getSwapRoute = useGetSwapRoute();

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
      const result = await getSwapRoute();

      if (!result) throw new Error("route not found from Swapper 🤯");

      const { steps } = result[0];
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
        request: result[0],
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [
    fromToken,
    fromValue,
    getSwapRoute,
    publicClient,
    selectedStrategy,
    swapMode,
    toToken,
  ]);
};

export const useGetSwapRoute = () => {
  const { address } = useAccount();
  const { fromToken, toToken, fromValue, swapMode } =
    useContext(MinimalSwapContext);

  const { selectedStrategy } = useContext(StrategyContext);
  const amount = useMemo(() => {
    if (!fromToken) return 0n;
    return BigInt(Math.round(fromValue * fromToken?.weiPerUnit));
  }, [fromToken, fromValue]);

  return useCallback(async () => {
    return getSwapRoute({
      address,
      amount,
      fromToken,
      toToken,
      strategy: selectedStrategy,
      swapMode,
    });
  }, [address, amount, fromToken, selectedStrategy, swapMode, toToken]);
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

export const usePreviewStrategyTokenMove = (swapMode: SwapMode) => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { fromValue } = useContext(MinimalSwapContext);
  const publicClient = usePublicClient({
    chainId: selectedStrategy.id,
  }) as Client;

  return useCallback(() => {
    return previewStrategyTokenMove(
      {
        strategy: selectedStrategy,
        swapMode,
        value: fromValue,
      },
      publicClient
    );
  }, [fromValue, swapMode, publicClient, selectedStrategy]);
};
