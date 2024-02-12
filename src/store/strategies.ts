import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cacheHash } from "~/utils/format";

import { Balance, Strategy } from "~/utils/interfaces";

export const CACHE_KEY = cacheHash("strategies");

export interface StrategiesState {
  list: Strategy[];
  selectedStrategyIndex: number;
  selectedStrategyGroup: string[];
  strategiesBalances: Balance[];
  searchString: string;
  selectedNetworks: string[];
  mappings: {
    strategiesByChainId: { [chainId: number]: Strategy[] };
    strategyBySlug: { [slug: string]: Strategy };
    indexBySlug: { [id: string]: number };
  };
}
export interface InitPayload {
  strategies: Strategy[];
}

const initialState: StrategiesState = {
  list: [],
  selectedStrategyIndex: 0,
  selectedStrategyGroup: [],
  strategiesBalances: [],
  searchString: "",
  selectedNetworks: [],
  mappings: {
    strategiesByChainId: {},
    strategyBySlug: {},
    indexBySlug: {},
  },
};

const updateMappings = (state: StrategiesState) => {
  state.mappings.indexBySlug = {};
  state.list.forEach((strategy, index) => {
    if (!state.mappings.strategiesByChainId[strategy.network.id])
      state.mappings.strategiesByChainId[strategy.network.id] = [];
    state.mappings.strategiesByChainId[strategy.network.id].push(strategy);

    state.mappings.strategyBySlug[strategy.slug] = strategy;
    state.mappings.indexBySlug[strategy.slug] = index;
  });
};

const strategiesSlice = createSlice({
  name: "strategies",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<InitPayload>) => {
      state.list = action.payload.strategies;
      updateMappings(state);
    },
    select: (state, action: PayloadAction<Strategy>) => {
      state.selectedStrategyIndex =
        state.mappings.indexBySlug[action.payload.slug];
    },
    selectGroup: (state, action: PayloadAction<Strategy[]>) => {
      state.selectedStrategyGroup = action.payload.map(
        (strategy) => strategy.slug
      );

      state.selectedStrategyIndex =
        state.mappings.indexBySlug[state.selectedStrategyGroup[0]];
    },
    search: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    },
    filterByNetworks: (state, action: PayloadAction<string[]>) => {
      state.selectedNetworks = action.payload;
    },
  },
});

export const { init, select, selectGroup, search, filterByNetworks } =
  strategiesSlice.actions;

export const StrategiesReducer = strategiesSlice.reducer;
