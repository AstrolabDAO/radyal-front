import { useCallback, useMemo } from "react";
import { Client } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { tokensIsEqual } from "~/utils";
import { previewStrategyTokenMove } from "~/utils/flows/strategy";
import { weiToAmount } from "~/utils/maths";
import { Strategy } from "~/utils/interfaces.ts";

import {
  ICommonStep,
  ITransactionRequestWithEstimate,
} from "@astrolabs/swapper";

import { useQueryClient } from "react-query";
import { executeSwap, getSwapRoute } from "~/services/swap";
import { useSwitchNetwork } from "./transaction";

import toast from "react-hot-toast";
import { useStore } from "react-redux";
import { Operation } from "~/model/operation";
import { StrategyInteraction } from "~/utils/constants";
import { useSelectedStrategy } from "./store/strategies";

import {
  useEstimationHash,
  useEstimationOnProgress,
  useFromToken,
  useFromValue,
  useInteraction,
  useSetEstimationOnprogress,
  useToToken,
} from "./store/swapper";

import { OperationStep } from "~/store/interfaces/operations";

export const useExecuteSwap = () => {
  const fromToken = useFromToken();
  const queryClient = useQueryClient();

  const hash = useEstimationHash();
  const publicClient = usePublicClient({
    chainId: fromToken?.network?.id,
  });

  const getSwapRoute = useGetSwapRoute();
  const switchNetwork = useSwitchNetwork(fromToken?.network?.id);

  const store = useStore();

  return useCallback(
    async (operation: Operation) => {
      await switchNetwork();

      const estimationRequest = queryClient.getQueryData(hash) as any;

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
          operationId: operation.id,
          label: "swap-pending",
          promise: swapPending,
        },
      });
      await swapPending;
      return swapHash;
    },
    [switchNetwork, queryClient, hash, publicClient, store, getSwapRoute]
  );
};

export const useEstimateRoute = () => {
  const fromToken = useFromToken();
  const toToken = useToToken();
  const interaction = useInteraction();
  const estimationOnProgress = useEstimationOnProgress();
  const setEstimationRouteOnProgress = useSetEstimationOnprogress();
  const getSwapRoute = useGetSwapRoute();

  const previewStrategyTokenMove = usePreviewStrategyTokenMove();

  return useCallback(async () => {
    try {
      if (estimationOnProgress) return;
      setEstimationRouteOnProgress(true);

      if (tokensIsEqual(fromToken, toToken)) {
        setEstimationRouteOnProgress(false);
        const result = await previewStrategyTokenMove();
        setEstimationRouteOnProgress(false);
        return result;
      }
      let result, interactionEstimation;
      if (
        fromToken.network.id === toToken.network.id ||
        StrategyInteraction.WITHDRAW === interaction
      ) {
        if (interaction === StrategyInteraction.DEPOSIT) {
          result = await getSwapRoute();
          /*interactionEstimation = await previewStrategyTokenMove(
          result[0].estimatedOutput
        );*/
        } else {
          interactionEstimation = await previewStrategyTokenMove();
          result = await getSwapRoute(interactionEstimation.estimation);
        }
      } else {
        result = await getSwapRoute();
      }

      if (!result) {
        toast.error("route not found from Swapper 🤯");
        setEstimationRouteOnProgress(false);
        return {
          error: "route not found from Swapper 🤯",
        };
      }

      const steps: OperationStep[] = result[0].steps.map(
        (step: ICommonStep) => ({
          ...step,
          via: result[0].aggregatorId,
        })
      );
      const lastStep = steps[steps.length - 1];

      const estimationStep =
        lastStep.type === "custom" ? steps[steps.length - 2] : lastStep;

      const receiveEstimation =
        result[0].estimatedOutput ??
        weiToAmount(
          estimationStep?.estimate?.toAmount,
          estimationStep?.toToken?.decimals
        );

      const computedSteps = !interactionEstimation
        ? steps
        : interaction === StrategyInteraction.DEPOSIT
          ? [
              ...steps,
              ...(tokensIsEqual(fromToken, toToken)
                ? interactionEstimation.steps
                : []),
            ]
          : [...interactionEstimation.steps, ...steps];
      setEstimationRouteOnProgress(false);
      return {
        id: window.crypto.randomUUID(),
        estimation: receiveEstimation,
        steps: computedSteps,
        request: result[0],
      };
    } catch (error) {
      console.error(error);
      toast.error("An error has occured");
    }
  }, [
    estimationOnProgress,
    setEstimationRouteOnProgress,
    fromToken,
    toToken,
    interaction,
    previewStrategyTokenMove,
    getSwapRoute,
  ]);
};

export const useGetSwapRoute = () => {
  const { address } = useAccount();
  const fromToken = useFromToken();
  const toToken = useToToken();
  const interaction = useInteraction();
  const fromValue = useFromValue();
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
        fromToken: "asset" in fromToken ? fromToken.asset : fromToken,
        toToken: "asset" in toToken ? toToken.asset : toToken,
        strategy: selectedStrategy,
        interaction,
      });
    },
    [address, fromToken, amount, toToken, selectedStrategy, interaction]
  );
};

export const usePreviewStrategyTokenMove = () => {
  const selectedStrategy = useSelectedStrategy();

  const fromValue = useFromValue();
  const interaction = useInteraction();
  const publicClient = usePublicClient({
    chainId: selectedStrategy?.network?.id ?? 1,
  }) as Client;

  const { address } = useAccount();
  return useCallback(
    (value: number = null) => {
      return previewStrategyTokenMove(
        {
          address,
          strategy: selectedStrategy,
          interaction,
          value: value ? value : fromValue,
        },
        publicClient
      );
    },
    [selectedStrategy, interaction, fromValue, publicClient]
  );
};
