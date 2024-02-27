import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cacheHash } from "~/utils/format";

import { Balance } from "~/utils/interfaces";
import { fetchStrategies, fetchStrategiesBalances } from "./api/astrolab";
import { StrategyInterface } from "~/model/strategy";

export const CACHE_KEY = cacheHash("strategies");

export interface StrategiesState {
  isLoading: boolean;
  list: StrategyInterface[];
  selectedStrategyIndex: number;
  selectedStrategyGroup: string[];
  strategiesBalances: Balance[];
  searchString: string;
  selectedNetworks: string[];
  indexBySlug: { [slug: string]: number };
}
export interface InitPayload {
  strategies: StrategyInterface[];
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
      state.isLoading = false;
      state.list.forEach((strategy, index) => {
        state.indexBySlug[strategy.slug] = index;
      });
    },
    select: (state, action: PayloadAction<StrategyInterface>) => {
      state.selectedStrategyIndex = state.indexBySlug[action.payload.slug];
    },
    selectGroup: (state, action: PayloadAction<StrategyInterface[]>) => {
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
  extraReducers: (builder) => {
    builder.addCase(fetchStrategies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStrategies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
      state.list.forEach((strategy, index) => {
        state.indexBySlug[strategy.slug] = index;
      });
    });
    builder.addCase(fetchStrategiesBalances.fulfilled, (state, action) => {
      state.strategiesBalances = action.payload;
    });
  },
});

export const { init, select, selectGroup, search, filterByNetworks } =
  strategiesSlice.actions;

export const StrategiesReducer = strategiesSlice.reducer;
