import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { StrategyInterface } from "~/model/strategy";
import { cacheHash } from "~/utils/format";

import { Balance, Strategy } from "~/utils/interfaces";

export const CACHE_KEY = cacheHash("strategies");

export interface StrategiesState {
  isLoading: boolean;
  list: Strategy[];
  selectedStrategyIndex: number;
  selectedStrategyGroup: string[];
  strategiesBalances: Balance[];
  searchString: string;
  selectedNetworks: string[];
  indexBySlug: { [slug: string]: number };
}
export interface InitPayload {
  strategies: Strategy[];
}

const initialState: StrategiesState = {
  isLoading: true,
  list: [],
  selectedStrategyIndex: 0,
  selectedStrategyGroup: [],
  strategiesBalances: [],
  searchString: "",
  selectedNetworks: [],
  indexBySlug: {},
};

const strategiesSlice = createSlice({
  name: "strategies",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<InitPayload>) => {
      state.list = action.payload.strategies;
      state.list.forEach((strategy, index) => {
        state.indexBySlug[strategy.slug] = index;
      });
    },
    select: (state, action: PayloadAction<Strategy>) => {
      state.selectedStrategyIndex = state.indexBySlug[action.payload.slug];
    },
    selectGroup: (state, action: PayloadAction<Strategy[]>) => {
      state.selectedStrategyGroup = action.payload.map(
        (strategy) => strategy.slug
      );
      state.selectedStrategyIndex =
        state.indexBySlug[state.selectedStrategyGroup[0]];
    },
    search: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    },
    filterByNetworks: (state, action: PayloadAction<string[]>) => {
      state.selectedNetworks = action.payload;
    },
  },
  /*extraReducers: (builder) => {
    builder.addCase(fetchStrategies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStrategies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
      updateMappings(state);
    });
  },*/
});

export const { init, select, selectGroup, search, filterByNetworks } =
  strategiesSlice.actions;

export const StrategiesReducer = strategiesSlice.reducer;
