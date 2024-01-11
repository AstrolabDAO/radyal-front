import { abi } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import { useCallback, useContext } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { StrategyContext } from "~/context/strategy-context";
import { useAllowance, useApprove, useSwitchNetwork } from "./transaction";

import toast from "react-hot-toast";
import { executeContract } from "~/services/transaction";

import { getWalletClient } from "wagmi/actions";

export const useSelectedStrategy = () => {
  const { selectedStrategy } = useContext(StrategyContext);

  return selectedStrategy;
};
export const useStrategyContractFunction = (functionName: string) => {
  if (abi.find((f) => f.name === functionName) === undefined)
    throw new Error(
      `Function ${functionName} does not exist on Strategy contract`
    );
  const strategy = useSelectedStrategy();
  const { network } = strategy;

  const { address } = useAccount();

  return useCallback(
    async (args?: any) => {
      const walletClient = await getWalletClient({
        chainId: network.id,
      });
      console.log("🚀 ~ file: strategy.ts:35 ~ walletClient:", walletClient);
      return walletClient.writeContract({
        address: strategy.address,
        abi,
        functionName,
        args,
      } as any);
      return await executeContract({
        abi: abi as any,
        address,
        chainId: network.id,
        functionName,
        args,
      });
    },
    [address, functionName, network.id, strategy.address]
  );
};

export const useDeposit = () => {
  const strategy = useSelectedStrategy();
  const { network } = strategy;
  const deposit = useStrategyContractFunction("safeDeposit");
  const switchNetwork = useSwitchNetwork(network.id);
  const { address } = useAccount();

  return useCallback(
    async (amount: bigint) => {
      await switchNetwork();
      try {
        return await deposit([amount, "0", address]);
      } catch (e) {
        console.error(e);
      }
    },
    [address, deposit, switchNetwork]
  );
};

export const useWithdraw = () => {
  const strategy = useSelectedStrategy();

  const { network, asset } = strategy;
  const withdraw = useStrategyContractFunction("safeWithdraw");
  const switchNetwork = useSwitchNetwork(network.id);
  const publicClient = usePublicClient({
    chainId: strategy?.network?.id,
  });

  const { address } = useAccount();
  return useCallback(
    async (value: number) => {
      await switchNetwork();
      const amount = BigInt(Math.round(value * asset.weiPerUnit));

      const hash = (await withdraw([
        amount,
        "1",
        address,
        address,
      ])) as `0x${string}`;

      const withdrawPending = publicClient.waitForTransactionReceipt({
        hash,
      });
      toast.promise(withdrawPending, {
        loading: "Withdraw is pending...",
        success: "Withdraw transaction successful",
        error: "withdraw reverted rejected 🤯",
      });
      return await withdrawPending;
    },
    [switchNetwork, asset.weiPerUnit, withdraw, address, publicClient]
  );
};

export const useApproveAndDeposit = () => {
  const strategy = useSelectedStrategy();
  const { address } = useAccount();
  const { asset, network } = strategy;

  /*const allowance = useAllowance({
    address: asset.address,
    chainId: asset.network.id,
    args: [address, strategy.address],
    enabled: false,
  }) as any as bigint;*/
  const allowance = 0n;
  //console.log("🚀 ~ useApproveAndDeposit ~ allowance:", allowance);

  const publicClient = usePublicClient({
    chainId: network.id,
  });

  const deposit = useDeposit();

  const approve = useApprove(asset);
  const switchNetwork = useSwitchNetwork(network.id);
  return useCallback(
    async (value: number) => {
      await switchNetwork();
      const amount = BigInt(value * asset.weiPerUnit);

      try {
        if (!allowance || allowance < amount) {
          const { hash: approveHash } = await approve({
            spender: strategy.address,
            amount,
          });

          const approvePending = publicClient.waitForTransactionReceipt({
            hash: approveHash,
          });
          toast.promise(approvePending, {
            loading: "Approve is pending...",
            success: "Approve transaction successful",
            error: "approve reverted rejected 🤯",
          });
          await approvePending;
        }
        const depositHash = (await deposit(amount)) as `0x${string}`;

        const depositPending = publicClient.waitForTransactionReceipt({
          hash: depositHash,
        });
        toast.promise(depositPending, {
          loading: "Deposit is pending...",
          success: "Deposit transaction successful",
          error: "deposit reverted rejected 🤯",
        });
        await depositPending;
      } catch (e) {
        console.error(e);
        toast.error("An error has occured");
      }
    },
    [
      allowance,
      approve,
      asset.weiPerUnit,
      deposit,
      publicClient,
      strategy.address,
      switchNetwork,
    ]
  );
};
