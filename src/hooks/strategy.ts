import { abi } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import { useCallback, useContext } from "react";
import { useAccount, useContractRead, usePublicClient } from "wagmi";
import { useApprove, useSwitchNetwork } from "./transaction";

import toast from "react-hot-toast";

import { ICommonStep } from "@astrolabs/swapper";
import { getWalletClient } from "@wagmi/core";
import { EstimationContext } from "~/context/estimation-context";
import { Operation, OperationStatus } from "~/model/operation";
import { OperationStep } from "~/store/interfaces/operations";
import { useCurrentStep, useEmmitStep } from "./store/operation";
import { useSelectedStrategy } from "./store/strategies";
import { useStore } from "react-redux";
import { getCurrentStep } from "~/services/operation";

export const useMaxRedeem = () => {
  const strategy = useSelectedStrategy();
  const { network } = strategy;
  const { address } = useAccount();

  return useContractRead({
    abi: abi,
    address: strategy.address,
    chainId: network.id,
    functionName: "maxRedeem",
    args: [address],
  })?.data;
};

export const useStrategyContractFunction = (functionName: string) => {
  if (abi.find((f) => f.name === functionName) === undefined)
    throw new Error(
      `Function ${functionName} does not exist on Strategy contract`
    );
  const strategy = useSelectedStrategy();
  const { network } = strategy;

  return useCallback(
    async (args?: any) => {
      const walletClient = await getWalletClient({
        chainId: network.id,
      });
      return walletClient.writeContract({
        address: strategy.address,
        abi,
        functionName,
        args,
      } as any);
    },
    [functionName, network.id, strategy.address]
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
  const withdraw = useStrategyContractFunction("safeRedeem");
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
  const { asset, network } = strategy;

  const publicClient = usePublicClient({
    chainId: network.id,
  });

  const deposit = useDeposit();

  const approve = useApprove(asset);
  const switchNetwork = useSwitchNetwork(network.id);
  const emmitStep = useEmmitStep();
  const { needApprove, estimation } = useContext(EstimationContext);
  const store = useStore();
  return useCallback(
    async (value: number) => {
      await switchNetwork();
      const amount = BigInt(value * asset.weiPerUnit);

      const _tx = new Operation({
        id: window.crypto.randomUUID(),
        status: OperationStatus.PENDING,
        steps: estimation.steps.map((step: ICommonStep) => {
          return {
            ...step,
            status: OperationStatus.PENDING,
          } as OperationStep;
        }),
        estimation,
      });

      try {
        if (needApprove) {
          const { hash: approveHash } = await approve({
            spender: strategy.address,
            amount,
          });

          const approvePending = publicClient.waitForTransactionReceipt({
            hash: approveHash,
          });
          store.dispatch({
            type: "operations/add",
            payload: _tx,
          });
          toast.promise(approvePending, {
            loading: "Approve is pending...",
            success: "Approve transaction successful",
            error: "approve reverted rejected 🤯",
          });

          if (getCurrentStep().type === "Approve")
            emmitStep({
              txId: _tx.id,
              promise: approvePending,
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
        store.dispatch({
          type: "operations/update",
          payload: {
            id: _tx.id,
            payload: {
              txHash: depositHash,
              status: OperationStatus.DONE,
              steps: _tx.steps.map((step) => {
                return {
                  ...step,
                  status: OperationStatus.DONE,
                };
              }),
            },
          },
        });
      } catch (e) {
        console.error(e);
        toast.error("An error has occured");
      }
    },
    [
      approve,
      asset.weiPerUnit,
      deposit,
      emmitStep,
      estimation,
      needApprove,
      publicClient,
      store,
      strategy.address,
      switchNetwork,
    ]
  );
};
