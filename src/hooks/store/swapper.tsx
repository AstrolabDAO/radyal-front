import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "~/store";
import { SetOnWritePayload } from "~/store/interfaces/swapper";
import {
  canSwapSelector,
  estimationIsEnabledSelector,
  interactionNeedToSwapSelector,
  needApproveSelector,
} from "~/store/selectors/swapper";
import {
  SelectTokenAction,
  SwapperState,
  init,
  selectToken,
  setEstimationIsLocked,
  setEstimationOnprogress,
  setFromValue,
  setHash,
  setInteraction,
  setInteractionEstimation,
  setLocked,
  setOnWrite,
  switchSelection,
} from "~/store/swapper";
import { StrategyInteraction } from "~/utils/constants";
import { cacheHash } from "~/utils/format";
import { Estimation } from "~/utils/interfaces";

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

  return cacheHash("estimate", interaction, fromToken, toToken, fromValue);
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
  return useSelector(
    (state: IRootState) =>
      state.swapper[state.swapper.interaction].estimatedRoute
  );
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

export const useInitSwapper = () => {
  const dispatch = useDispatch();
  return useCallback(
    (state: Partial<SwapperState>) => {
      return dispatch(init(state));
    },
    [dispatch]
  );
};

export const useSelectToken = () => {
  const dispatch = useDispatch();
  return useCallback(
    (action: SelectTokenAction) => {
      return dispatch(selectToken(action));
    },
    [dispatch]
  );
};

export const useSetHash = () => {
  const dispatch = useDispatch();
  return useCallback(
    (hash: string) => {
      dispatch(setHash(hash));
    },
    [dispatch]
  );
};

export const useSwitchSelection = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(switchSelection());
  }, [dispatch]);
};

export const useSetInteraction = () => {
  const dispatch = useDispatch();
  return useCallback(
    (interaction: StrategyInteraction) => {
      dispatch(setInteraction(interaction));
    },
    [dispatch]
  );
};

export const useSetEstimationIsLocked = () => {
  const dispatch = useDispatch();
  return useCallback(
    (value: boolean) => {
      dispatch(setEstimationIsLocked(value));
    },
    [dispatch]
  );
};

export const useSetLocked = () => {
  const dispatch = useDispatch();
  return useCallback(
    (value: boolean) => {
      dispatch(setLocked(value));
    },
    [dispatch]
  );
};

export const useSetFromValue = () => {
  const dispatch = useDispatch();
  return useCallback(
    (value: number) => {
      dispatch(setFromValue(value));
    },
    [dispatch]
  );
};

export const useSetEstimationOnprogress = () => {
  const dispatch = useDispatch();
  return useCallback(
    (value: boolean) => {
      dispatch(setEstimationOnprogress(value));
    },
    [dispatch]
  );
};

export const useSetInteractionEstimation = () => {
  const dispatch = useDispatch();
  return useCallback(
    (estimation: Estimation) => {
      dispatch(setInteractionEstimation(estimation));
    },
    [dispatch]
  );
};

export const useSetOnWrite = () => {
  const dispatch = useDispatch();
  return useCallback(
    (value: SetOnWritePayload) => {
      dispatch(setOnWrite(value));
    },
    [dispatch]
  );
};
