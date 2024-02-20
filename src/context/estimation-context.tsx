import { createContext, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { useSelectedStrategy } from "~/hooks/strategies";
import {
  useEstimationHash,
  useEstimationIsEnabled,
  useFromToken,
  useFromValue,
  useInteraction,
  useInteractionNeedToSwap,
} from "~/hooks/swapper";
import { useAllowance } from "~/hooks/transaction";
import { estimate, updateEstimation } from "~/services/estimation";
import { setInteractionEstimation } from "~/services/swapper";

const EstimationContext = createContext({});

const EstimationProvider = ({ children }) => {
  const hash = useEstimationHash();

  const isEnabled = useEstimationIsEnabled();

  const fromValue = useFromValue();
  const fromToken = useFromToken();
  const selectedStrategy = useSelectedStrategy();
  const interaction = useInteraction();
  const interactionNeedToSwap = useInteractionNeedToSwap();
  const { address } = useAccount();

  const { data: estimationData } = useQuery(`estimation-${hash}`, estimate, {
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 5000,
    enabled: isEnabled,
  });

  const [allowanceToken, spender] = useMemo(() => {
    if (!fromToken) return [null, null];

    const allowanceToken = "asset" in fromToken ? fromToken?.asset : fromToken;

    const spender = !interactionNeedToSwap
      ? selectedStrategy?.address
      : estimationData?.request?.approvalAddress;

    if (!spender) return [null, null];
    return [allowanceToken, spender];
  }, [
    estimationData?.request?.approvalAddress,
    fromToken,
    interactionNeedToSwap,
    selectedStrategy?.address,
  ]);

  const allowance = useAllowance({
    address: allowanceToken?.address,
    chainId: allowanceToken?.network?.id,
    args: [address, spender],
    enabled:
      !!allowanceToken && !!spender && allowanceToken?.address !== zeroAddress,
  }) as any as bigint;

  const needApprove = useMemo(() => {
    if (!allowance || !fromToken) return true;
    return allowance < BigInt(fromValue * fromToken.weiPerUnit);
  }, [allowance, fromToken, fromValue]);

  useEffect(() => {
    setInteractionEstimation(null);
  }, [hash]);
  useEffect(() => {
    updateEstimation(estimationData);
  }, [estimationData]);

  return (
    <EstimationContext.Provider value={{ estimationData }}>
      {children}
    </EstimationContext.Provider>
  );
};

export { EstimationContext, EstimationProvider };
