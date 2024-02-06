import { ICommonStep } from "@astrolabs/swapper";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useNetwork, usePublicClient } from "wagmi";
import { switchNetwork } from "wagmi/actions";
import SwapStepsModal from "~/components/modals/SwapStepsModal";
import { Operation, OperationStatus } from "~/model/operation";
import { addOperation, emmitStep, updateOperation } from "~/services/operation";
import { getSwapperStore } from "~/services/swapper";
import { approve } from "~/services/transaction";
import { OperationStep } from "~/store/interfaces/operations";
import { useCloseModal, useOpenModal } from "./store/modal";
import {
  useCanSwap,
  useEstimatedRoute,
  useFromToken,
  useFromValue,
  useSetEstimationIsLocked,
  useSetLocked,
  useSetOnWrite,
  useToToken,
} from "./store/swapper";
import { useExecuteSwap } from "./swap";
export const useWriteDebounce = () => {
  const setOnWrite = useSetOnWrite();
  const fromValue = useFromValue();

  useEffect(() => {
    if (!fromValue) return;

    const debounce = getSwapperStore().debounceTimer;

    if (debounce) clearTimeout(debounce);
    setOnWrite({
      onWrite: true,
      debounceTimer: setTimeout(() => {
        setOnWrite({
          onWrite: false,
        });
      }, 1000),
    });
  }, [fromValue, setOnWrite]);
};

export const useExectuteSwapperRoute = () => {
  const publicClient = usePublicClient();
  const fromToken = useFromToken();
  const toToken = useToToken();
  const canSwap = useCanSwap();
  const setLocked = useSetLocked();
  const openModal = useOpenModal();
  const closeModal = useCloseModal();
  const setEstimationIsLocked = useSetEstimationIsLocked();
  const estimation = useEstimatedRoute();

  const executeSwap = useExecuteSwap();
  const currentNetwork = useNetwork();
  return useCallback(async () => {
    if (!fromToken || !toToken || !canSwap) return;
    setEstimationIsLocked(true);
    setLocked(true);
    openModal(<SwapStepsModal />);
    const operation = new Operation({
      id: window.crypto.randomUUID(),
      fromToken,
      toToken,
      steps: estimation.steps.map((step: ICommonStep) => {
        return {
          ...step,
          status: OperationStatus.WAITING,
        } as OperationStep;
      }),
      estimation,
    });

    try {
      if (currentNetwork.chain.id !== fromToken.network.id)
        await switchNetwork({ chainId: fromToken?.network?.id });
      if (estimation.steps[0].type === "Approve") {
        const approveStep = estimation.steps[0];

        addOperation(operation);
        const { hash: approveHash } = await approve({
          spender: approveStep.toAddress as `0x${string}`,
          amount: BigInt(approveStep.fromAmount),
          address: approveStep.fromAddress as `0x${string}`,
          chainId: approveStep.fromChain,
        });
        const approvePending = publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });
        toast.promise(approvePending, {
          loading: "Approve is pending...",
          success: "Approve transaction successful",
          error: "approve reverted rejected 🤯",
        });
        emmitStep({
          operationId: operation.id,
          promise: approvePending,
        });
        const hash = await executeSwap(operation);
        updateOperation({
          id: operation.id,
          payload: {
            status: OperationStatus.PENDING,
            txHash: hash,
          },
        });
      } else {
        addOperation(operation);
        const hash = await executeSwap(operation);
        updateOperation({
          id: operation.id,
          payload: {
            status: OperationStatus.PENDING,
            txHash: hash,
          },
        });
      }
    } catch (error) {
      closeModal();
      setEstimationIsLocked(false);
      setLocked(false);
      toast.error(error.message);
      updateOperation({
        id: operation.id,
        payload: {
          status: OperationStatus.FAILED,
        },
      });
    }
  }, [
    canSwap,
    closeModal,
    currentNetwork.chain.id,
    estimation,
    executeSwap,
    fromToken,
    openModal,
    publicClient,
    setEstimationIsLocked,
    setLocked,
    toToken,
  ]);
};
