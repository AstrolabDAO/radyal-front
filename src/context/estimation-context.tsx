import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useStore } from "react-redux";
import { zeroAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useEstimateRoute, useExecuteSwap } from "~/hooks/swap";
import { useAllowance, useSwitchNetwork } from "~/hooks/transaction";
import { approve } from "~/services/transaction";
import { cacheHash } from "~/utils/format";
import { Strategy } from "~/utils/interfaces";
import { SwapContext } from "./swap-context";

import { ICommonStep } from "@astrolabs/swapper";
import { Operation, OperationStatus } from "~/model/operation";

import SwapStepsModal from "~/components/modals/SwapStepsModal";
import { useSelectedStrategy } from "~/hooks/store/strategies";
import { getCurrentStep } from "~/services/operation";
import { OperationStep } from "~/store/interfaces/operations";
import { SwapModalContext } from "./swap-modal-context";

const EstimationContext = createContext<EstimationContextType>({
  swap: async () => {},
  lockEstimate: () => {},
  unlockEstimate: () => {},
  toValue: null,
  estimation: null,
  estimationError: null,
  needApprove: false,
});

let debounceTimer;

const EstimationProvider = ({ children }) => {
  const {
    fromValue,
    fromToken,
    toToken,
    action,
    canSwap,
    setCanSwap,
    actionNeedToSwap,
  } = useContext(SwapContext);
  const { openModal } = useContext(SwapModalContext);

  const selectedStrategy = useSelectedStrategy();
  const [writeOnProgress, setWriteOnprogress] = useState<boolean>(true);
  const [estimationOnProgress, setEstimationOnProgress] =
    useState<boolean>(false);

  const { address } = useAccount();

  const [toValue, setToValue] = useState<number>(null);

  const [estimationError, setEstimationError] = useState<string>(null);

  const [updateEstimation, setUpdateEstimation] = useState(true);

  const estimateRoute = useEstimateRoute();

  const executeSwap = useExecuteSwap();

  const switchNetwork = useSwitchNetwork(fromToken?.network?.id);
  const publicClient = usePublicClient();
  const { data: estimationData } = useQuery(
    cacheHash("estimate", action, fromToken, toToken, fromValue),
    async () => {
      if (estimationOnProgress) return;
      setEstimationOnProgress(true);
      setEstimationError(null);
      const estimate = await estimateRoute();

      setEstimationOnProgress(false);
      return estimate;
    },
    {
      staleTime: 1000 * 15,
      cacheTime: 1000 * 15,
      retry: true,
      refetchInterval: 1000 * 15,
      enabled: !!(
        fromToken &&
        fromValue > 0 &&
        !writeOnProgress &&
        !estimationOnProgress &&
        updateEstimation &&
        fromValue > 0
      ),
    }
  );

  const [allowanceToken, toAllowanceAddress] = useMemo(() => {
    if (!fromToken) return [null, null];
    const _token = fromToken as Strategy;
    const allowanceToken = _token?.asset ? _token.asset : _token;

    const spender = !actionNeedToSwap
      ? selectedStrategy?.address
      : estimationData?.request?.approvalAddress;

    if (!spender) return [null, null];
    return [allowanceToken, spender];
  }, [
    actionNeedToSwap,
    estimationData?.request?.approvalAddress,
    fromToken,
    selectedStrategy?.address,
  ]);

  const allowance = useAllowance({
    address: allowanceToken?.address,
    chainId: allowanceToken?.network?.id,
    args: [address, toAllowanceAddress],
    enabled:
      !!allowanceToken &&
      !!toAllowanceAddress &&
      allowanceToken?.address !== zeroAddress,
  }) as any as bigint;

  const needApprove = useMemo(() => {
    if (!allowance || !fromToken) return true;
    return allowance < BigInt(fromValue * fromToken.weiPerUnit);
  }, [allowance, fromToken, fromValue]);

  const estimation: any = useMemo(() => {
    if (!estimationData) return null;
    const txSteps = estimationData?.steps;

    if (needApprove && txSteps && txSteps[0].type !== "Approve") {
      txSteps.unshift({
        id: window.crypto.randomUUID(),
        type: "Approve",
        tool: "radyal",
        fromChain: fromToken?.network?.id,
        toChain: fromToken?.network?.id,
        fromAmount: fromValue * fromToken.weiPerUnit,
        fromToken,
        estimate: {
          tool: "custom",
          fromAmount: fromValue * fromToken.weiPerUnit,
        },
      });
    }
    return {
      ...estimationData,
      steps: txSteps,
    };
  }, [estimationData, fromToken, fromValue, needApprove]);

  useEffect(() => {
    if (!estimation || estimation?.error) {
      setToValue(estimationOnProgress ? null : 0);
      setCanSwap(false);
      if (estimation?.error) setEstimationError(estimation.error);
      return;
    }

    setToValue(estimation.estimation);
    setCanSwap(true);
  }, [
    estimation,
    estimationOnProgress,
    fromToken,
    fromValue,
    needApprove,
    setCanSwap,
  ]);

  const store = useStore();

  useEffect(() => {
    if (!fromValue) return;
    setWriteOnprogress(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setWriteOnprogress(false);
    }, 1000);
  }, [fromValue]);

  const swap = useCallback(async () => {
    if (!fromToken || !toToken || !canSwap) return;
    setUpdateEstimation(false);
    const close = openModal(<SwapStepsModal />);
    setCanSwap(false);
    const _tx = new Operation({
      id: window.crypto.randomUUID(),
      steps: estimation.steps.map((step: ICommonStep) => {
        return {
          ...step,
          status: OperationStatus.WAITING,
        } as OperationStep;
      }),
      estimation,
    });

    try {
      await switchNetwork();

      if (needApprove) {
        const amount = BigInt(Math.round(fromValue * fromToken.weiPerUnit));
        const approvalAmount = amount; //+ amount / 500n; // 5%
        store.dispatch({
          type: "operations/add",
          payload: _tx,
        });
        const { hash: approveHash } = await approve({
          spender: toAllowanceAddress as `0x${string}`,
          amount: approvalAmount,
          address: fromToken.address,
          chainId: fromToken.network.id,
        });

        const approvePending = publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });
        toast.promise(approvePending, {
          loading: "Approve is pending...",
          success: "Approve transaction successful",
          error: "approve reverted rejected 🤯",
        });
        const currentStep = getCurrentStep();

        if (currentStep?.type === "Approve") {
          store.dispatch({
            type: "operations/emmitStep",
            payload: {
              txId: _tx.id,
              promise: approvePending,
            },
          });

          await approvePending;
          const swapPromise = executeSwap();
          store.dispatch({
            type: "operations/emmitStep",
            payload: {
              txId: _tx.id,
              promise: swapPromise,
            },
          });
          const swapResult = await swapPromise;
          const { hash, route } = swapResult;

          store.dispatch({
            type: "operations/update",
            payload: {
              id: _tx.id,
              payload: {
                txHash: hash,
                estimation: route,
                status: OperationStatus.PENDING,
              },
            },
          });
        }
      } else {
        store.dispatch({
          type: "operations/add",
          payload: _tx,
        });
        const { hash, route } = await executeSwap();
        _tx.estimation = route;
        store.dispatch({
          type: "operations/update",
          payload: {
            id: _tx.id,
            payload: {
              txHash: hash,
              estimation: route,
              status: OperationStatus.PENDING,
            },
          },
        });
        store.dispatch({
          type: "operations/emmitStep",
          payload: {
            txId: _tx.id,
            promise: publicClient.waitForTransactionReceipt({
              hash,
            }),
          },
        });
      }
    } catch (error) {
      close();
      setUpdateEstimation(true);
      setCanSwap(true);
      toast.error(error.message);
      store.dispatch({
        type: "operations/update",
        payload: {
          id: _tx.id,
          payload: {
            status: OperationStatus.FAILED,
          },
        },
      });
    }
  }, [
    canSwap,
    estimation,
    executeSwap,
    fromToken,
    fromValue,
    needApprove,
    openModal,
    publicClient,
    setCanSwap,
    store,
    switchNetwork,
    toAllowanceAddress,
    toToken,
  ]);

  return (
    <EstimationContext.Provider
      value={{
        toValue,
        estimation,
        estimationError,
        needApprove,
        swap,
        unlockEstimate: () => setUpdateEstimation(true),
        lockEstimate: () => setUpdateEstimation(false),
      }}
    >
      {children}
    </EstimationContext.Provider>
  );
};
interface EstimationContextType {
  swap: () => Promise<void>;
  lockEstimate: () => void;
  unlockEstimate: () => void;
  estimation: any; // todo: change it;
  estimationError: string;
  toValue: number;
  needApprove: boolean;
}

export { EstimationContext, EstimationProvider };
