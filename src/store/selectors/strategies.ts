import { createSelector } from "@reduxjs/toolkit";
import { IRootState } from "..";
import { Strategy } from "~/utils/interfaces";
import { Network } from "~/model/network";

export const strategiesSelector = createSelector(
  (state: IRootState) => state.strategies,
  (state) => state.list
);

export const createGrouppedStrategiesSelector = (filtered = true) => {
  return createSelector(
    [
      (state: IRootState) => state.strategies.list,
      (state: IRootState) => state.strategies.selectedNetworks,
      (state: IRootState) => state.strategies.searchString,
    ],
    (strategies, selectedNetworks, searchString): Strategy[][] => {
      const grouppedStrategies = {};

      strategies
        .filter(({ network }) => {
          if (!filtered) return true;
          if (!selectedNetworks.length) return true;
          return selectedNetworks.includes(network.slug);
        })
        .filter((item) => {
          if (!filtered) return true;
          return Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchString.toLowerCase())
          );
        })
        .forEach((strategy) => {
          const splittedSlug = strategy.slug.split(":")[1];
          if (!grouppedStrategies[splittedSlug])
            grouppedStrategies[splittedSlug] = [];
          grouppedStrategies[splittedSlug].push(strategy);
        });
      return Object.values(grouppedStrategies);
    }
  );
};

export const selectedStrategyGroupSelector = createSelector(
  (state: IRootState) => state.strategies,
  (state) => {
    return state.selectedStrategyGroup.map((slug) => {
      return Strategy.bySlug[slug];
    });
  }
);
export const selectedStrategySelector = createSelector(
  [
    (state) => state.strategies.list,
    (state) => state.strategies.selectedStrategyIndex,
  ],
  (strategies, index) => {
    return strategies[index];
  }
);

export const strategyBySlugSelector = createSelector(
  [(state) => state.strategies.mappings.strategyBySlug],
  (strategyBySlug) => {
    return (slug: string) => strategyBySlug[slug];
  }
);

export const strategiesNetworksSelector = createSelector(
  [(state: IRootState) => state.strategies.list],
  (strategies) => {
    const networks: { [id: number]: Network } = {};
    strategies.forEach((strategy) => {
      networks[strategy.network.id] = strategy.network;
    });
    return Object.values(networks);
  }
);
