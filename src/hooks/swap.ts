import { useCallback, useContext, useMemo } from "react";
import { Client, getContract } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { StrategyContext } from "~/context/strategy-context";
import { MinimalSwapContext } from "~/context/swap-context";
import { currentChain } from "~/context/web3-context";
import { tokensIsEqual } from "~/utils";
import { SwapMode } from "~/utils/constants";
import { previewStrategyTokenMove, withdraw } from "~/utils/flows/strategy";
import { amountToEth, cacheHash } from "~/utils/format";
import { WithdrawRequest } from "~/utils/interfaces.ts";

import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";
import { erc20Abi } from "abitype/abis";
import { useQueryClient } from "react-query";
import { aproveAndSwap, getSwapRoute } from "~/services/swap";
import { useReadTx, useSwitchNetwork } from "./transaction";

export const useExecuteSwap = () => {
  const { fromToken, toToken, fromValue, swapMode } =
    useContext(MinimalSwapContext);

  const { address } = useAccount();

  const queryClient = useQueryClient();
  const publicClient: Client = usePublicClient({
    chainId: fromToken?.network?.id,
  });

  const amount = useMemo(() => {
    if (!fromToken) return 0n;
    return BigInt(Math.round(fromValue * fromToken.weiPerUnit));
  }, [fromToken, fromValue]);

  const getSwapRoute = useGetSwapRoute();
  const switchNetwork = useSwitchNetwork(fromToken?.network?.id);

  return useCallback(async () => {
    await switchNetwork();

    const estimationRequest = queryClient.getQueryData(
      cacheHash("estimate", swapMode, fromToken, toToken, fromValue)
    ) as any;

    let tr: ITransactionRequestWithEstimate = estimationRequest?.request;

    if (!tr) {
      const routes = await getSwapRoute();
      tr = routes[0];
    }

    const routerAddress = estimationRequest
      ? estimationRequest?.request?.to
      : null;

    const contract = getContract({
      address: fromToken.address,
      abi: erc20Abi,
      publicClient,
    });

    const allowance: bigint = (await contract.read.allowance([
      address,
      routerAddress,
    ])) as bigint;

    const approvalAmount = amount + amount / 500n; // 5%

    return aproveAndSwap(
      {
        route: tr,
        routerAddress,
        allowance,
        fromToken,
        amount: approvalAmount,
      },
      publicClient
    );
  }, [
    address,
    amount,
    fromToken,
    fromValue,
    getSwapRoute,
    publicClient,
    queryClient,
    swapMode,
    switchNetwork,
    toToken,
  ]);
};

export const useEstimateRoute = () => {
  const { fromToken, toToken, swapMode } = useContext(MinimalSwapContext);

  const getSwapRoute = useGetSwapRoute();

  const previewStrategyTokenMove = usePreviewStrategyTokenMove();
  return useCallback(async () => {
    try {
      const interactionEstimation =
        tokensIsEqual(fromToken, toToken) || swapMode === SwapMode.WITHDRAW
          ? await previewStrategyTokenMove()
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
  }, [fromToken, getSwapRoute, previewStrategyTokenMove, swapMode, toToken]);
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

export const usePreviewStrategyTokenMove = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const { fromValue, swapMode } = useContext(MinimalSwapContext);
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
