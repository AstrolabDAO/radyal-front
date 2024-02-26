import { useMemo } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/store";
import {
  canSwapSelector,
  estimatedRouteSelector,
  estimationIsEnabledSelector,
  interactionNeedToSwapSelector,
  needApproveSelector,
} from "~/store/selectors/swapper";
import { cacheHash } from "~/utils/format";

export const useSwapperStore = () =>
  useSelector((state: IRootState) => state.swapper);

export const useIsInit = () => useSwapperStore().is.init;
export const useIsSelection = () => useSwapperStore().is.selection;
export const useInteraction = () => useSwapperStore().interaction;
export const useCanSwap = () => useSelector(canSwapSelector);
export const useHash = () => useSwapperStore().hash;
export const useOnWrite = () => {
  return useSwapperStore().is.onWrite;
};

export const useNeedApprove = () => {
  return useSelector(needApproveSelector);
};
export const useInteractionNeedToSwap = () => {
  return useSelector(interactionNeedToSwapSelector);
};

export const useEstimationHash = () => {
  const interaction = useInteraction();
  const fromToken = useFromToken();
  const toToken = useToToken();
  const fromValue = useFromValue();

  return useMemo(
    () => cacheHash("estimate", interaction, fromToken, toToken, fromValue),
    [interaction, fromToken, toToken, fromValue]
  );
};
export const useEstimationOnProgress = () =>
  useSelector((state: IRootState) => state.swapper.is.estimationOnprogress);

export const useEstimationIsEnabled = () => {
  return useSelector(estimationIsEnabledSelector);
};
export const useFromValue = () => {
  return useSelector(
    (state: IRootState) => state.swapper[state.swapper.interaction].value
  );
};
export const useEstimatedRoute = () => {
  return useSelector(estimatedRouteSelector);
};

export const useFromToken = () => {
  return useSelector(
    (state: IRootState) => state.swapper[state.swapper.interaction].from
  );
};
export const useToToken = () => {
  return useSelector(
    (state: IRootState) => state.swapper[state.swapper.interaction].to
  );
};
