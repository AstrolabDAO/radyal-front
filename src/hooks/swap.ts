import { useCallback, useContext, useMemo } from "react";
import { Client } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { tokensIsEqual } from "~/utils";
import { previewStrategyTokenMove } from "~/utils/flows/strategy";
import { weiToAmount, cacheHash } from "~/utils/format";
import { Strategy } from "~/utils/interfaces.ts";

import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";

import { useQueryClient } from "react-query";
import { aproveAndSwap, executeSwap, getSwapRoute } from "~/services/swap";
import { useSwitchNetwork } from "./transaction";

import toast from "react-hot-toast";
import { SwapContext } from "~/context/swap-context";
import { StrategyInteraction } from "~/utils/constants";
import { useSelectedStrategy } from "./store/strategies";
import { useStore } from "react-redux";
import { Operation } from "~/model/operation";

export const useExecuteSwap = () => {
  const { fromValue, fromToken, toToken, action } = useContext(SwapContext);

  const { address } = useAccount();

  const queryClient = useQueryClient();
  const publicClient = usePublicClient({
    chainId: fromToken?.network?.id,
  });

  const amount = useMemo(() => {
    if (!fromToken) return 0n;
    return BigInt(Math.round(fromValue * fromToken.weiPerUnit));
  }, [fromToken, fromValue]);

  const getSwapRoute = useGetSwapRoute();
  const switchNetwork = useSwitchNetwork(fromToken?.network?.id);

  const store = useStore()

  return useCallback(async (operation: Operation) => {
    await switchNetwork();

    const estimationRequest = queryClient.getQueryData(
      cacheHash("estimate", action, fromToken, toToken, fromValue)
    ) as any;

    let tr: ITransactionRequestWithEstimate = estimationRequest?.request;

    if (!tr) {
      const routes = await getSwapRoute();
      tr = routes[0];
    }
    const { hash: swapHash } = await executeSwap(tr);
    const swapPending = publicClient.waitForTransactionReceipt({
      hash: swapHash,
    });
    toast.promise(swapPending, {
      loading: "Swap transaction is pending...",
      success: "Swap transaction successful",
      error: "Swap reverted rejected 🤯",
    });

    store.dispatch({
      type: "operations/emmitStep",
      payload: {
        txId: operation.id,
        promise: swapPending,
      },
    });
    return swapHash;
  }, [
    store,
    fromToken,
    fromValue,
    getSwapRoute,
    publicClient,
    queryClient,
    action,
    switchNetwork,
    toToken,
  ]);
};

export const useEstimateRoute = () => {
  const { fromToken, toToken, action } = useContext(SwapContext);

  const getSwapRoute = useGetSwapRoute();

  const previewStrategyTokenMove = usePreviewStrategyTokenMove();
  return useCallback(async () => {
    if (tokensIsEqual(fromToken, toToken)) {
      return await previewStrategyTokenMove();
    }

    let result, interactionEstimation;
    if (
      fromToken.network.id === toToken.network.id ||
      StrategyInteraction.WITHDRAW === action
    ) {
      if (action === StrategyInteraction.DEPOSIT) {
        result = await getSwapRoute();
        interactionEstimation = await previewStrategyTokenMove(
          result[0].estimatedOutput
        );
      } else {
        interactionEstimation = await previewStrategyTokenMove();
        result = await getSwapRoute(interactionEstimation.estimation);
      }
    } else {
      result = await getSwapRoute();
    }

    if (!result) {
      toast.error("route not found from Swapper 🤯");
      return {
        error: "route not found from Swapper 🤯",
      };
    }
    const { steps } = result[0];
    const lastStep = steps[steps.length - 1];

    const estimationStep =
      lastStep.type === "custom" ? steps[steps.length - 2] : lastStep;

    const receiveEstimation = weiToAmount(
      estimationStep?.estimate?.toAmount,
      estimationStep?.toToken?.decimals
    );

    const computedSteps = !interactionEstimation
      ? steps
      : action === StrategyInteraction.DEPOSIT
        ? [
            ...steps,
            ...(tokensIsEqual(fromToken, toToken)
              ? interactionEstimation.steps
              : []),
          ]
        : [...interactionEstimation.steps, ...steps];
    return {
      id: window.crypto.randomUUID(),
      estimation: receiveEstimation,
      steps: computedSteps,
      request: result[0],
    };
  }, [fromToken, getSwapRoute, previewStrategyTokenMove, action, toToken]);
};

export const useGetSwapRoute = () => {
  const { address } = useAccount();
  const { fromValue, fromToken, toToken, action } = useContext(SwapContext);

  const selectedStrategy = useSelectedStrategy();

  const amount = useMemo(() => {
    if (!fromToken) return 0n;
    return BigInt(Math.round(fromValue * fromToken?.weiPerUnit));
  }, [fromToken, fromValue]);

  return useCallback(
    async (value: number = null) => {
      return getSwapRoute({
        address,
        amount: value
          ? BigInt(Math.round(value * fromToken?.weiPerUnit))
          : amount,
        fromToken,
        toToken: (toToken as Strategy)?.asset
          ? (toToken as Strategy).asset
          : toToken,
        strategy: selectedStrategy,
        action,
      });
    },
    [address, amount, fromToken, selectedStrategy, action, toToken]
  );
};

export const usePreviewStrategyTokenMove = () => {
  const selectedStrategy = useSelectedStrategy();
  const { fromValue, action } = useContext(SwapContext);

  const publicClient = usePublicClient({
    chainId: selectedStrategy?.network?.id ?? 1,
  }) as Client;

  return useCallback(
    (value: number = null) => {
      return previewStrategyTokenMove(
        {
          strategy: selectedStrategy,
          action,
          value: value ? value : fromValue,
        },
        publicClient
      );
    },
    [fromValue, action, publicClient, selectedStrategy]
  );
};
