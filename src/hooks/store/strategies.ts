import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "~/store";
import {
  grouppedStrategiesSelector,
  selectedStrategyGroupSelector,
  selectedStrategySelector,
  strategiesNetworksSelector,
  strategyBySlugSelector,
} from "~/store/selectors/strategies";
import { selectStrategy, selectStrategyGroup } from "~/store/strategies";
import { Strategy } from "~/utils/interfaces";

export const useStrategiesStore = () => {
  return useSelector((state: IRootState) => state.strategies);
};

export const useStrategies = () => {
  return useSelector((state: IRootState) => state.strategies.list);
};

export const useSelectedStrategy = () => {
  return useSelector(selectedStrategySelector);
};
export const useStrategyBySlug = () => {
  return useSelector(strategyBySlugSelector);
};
export const useGrouppedStrategies = () => {
  return useSelector(grouppedStrategiesSelector);
};

export const useSelectedStrategyGroup = () => {
  return useSelector(selectedStrategyGroupSelector);
};

export const useStrategiesNetworks = () => {
  return useSelector(strategiesNetworksSelector);
};

export const useSelectStrategy = () => {
  const dispatch = useDispatch();
  return useCallback(
    (strategy: Strategy) => dispatch(selectStrategy(strategy)),
    [dispatch]
  );
};

export const useSelectStrategyGroup = () => {
  const dispatch = useDispatch();
  return useCallback(
    (strategies: Strategy[]) => dispatch(selectStrategyGroup(strategies)),
    [dispatch]
  );
};
