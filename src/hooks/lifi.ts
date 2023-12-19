import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";
import { routerByChainId } from "@astrolabs/swapper/dist/src/LiFi";
import { erc20Abi } from "abitype/abis";
import { useCallback, useContext } from "react";
import { useQueryClient } from "react-query";
import { zeroAddress } from "viem";
import { useAccount, useContractRead, usePublicClient } from "wagmi";
import { MinimalSwapContext } from "~/context/swap-context";
import { executeSwap } from "~/services/lifi";
import { cacheHash } from "~/utils/format";
import { SwapEstimation } from "~/utils/interfaces";
import { _switchNetwork } from "~/utils/web3";
import { useGetSwapRoute } from "./swap";

export const useLiFiExecuteSwap = () => {
  const { fromToken, toToken, fromValue, swapMode } =
    useContext(MinimalSwapContext);
  const { address } = useAccount();

  const queryClient = useQueryClient();
  const publicClient = usePublicClient({
    chainId: fromToken?.network?.id,
  });

  const routerAddress: `0x${string}` = routerByChainId[
    fromToken?.network.id
  ] as `0x${string}`;

  const { data: allowance } = useContractRead({
    chainId: fromToken?.network?.id,
    address: fromToken?.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, routerAddress],
    enabled: fromToken && fromToken?.address !== zeroAddress,
  });

  const getSwapRoute = useGetSwapRoute();

  return useCallback(async () => {
    await _switchNetwork(fromToken?.network?.id);
    const amount = BigInt(Math.round(fromValue * fromToken.weiPerUnit));
    const oldEstimation: SwapEstimation = queryClient.getQueryData(
      cacheHash("estimate", swapMode, fromToken, toToken, fromValue)
    );

    let routes: ITransactionRequestWithEstimate[] = oldEstimation?.request;

    if (!routes) {
      routes = await getSwapRoute();
    }

    const approvalAmount = amount + amount / 500n; // 5%

    executeSwap(
      {
        route: routes[0],
        routerAddress,
        allowance,
        fromToken,
        amount: approvalAmount,
      },
      publicClient
    );
  }, [
    allowance,
    fromToken,
    fromValue,
    getSwapRoute,
    publicClient,
    queryClient,
    routerAddress,
    swapMode,
    toToken,
  ]);
};
