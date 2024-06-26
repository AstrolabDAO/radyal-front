import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cacheHash } from "~/utils/format";

import { Balance, CoinGeckoPrices } from "~/utils/interfaces";
import { fetchStrategies, fetchStrategiesBalances } from "./api/astrolab";
import { Strategy, IStrategy } from "~/model/strategy";

export const CACHE_KEY = cacheHash("strategies");

export interface StrategiesState {
  isLoading: boolean;
  list: IStrategy[];
  selectedStrategyIndex: number;
  selectedStrategyGroup: string[];
  strategiesBalances: Balance[];
  searchString: string;
  selectedNetworks: string[];
  indexBySlug: { [slug: string]: number };
}
export interface InitPayload {
  strategies: IStrategy[];
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
    select: (state, action: PayloadAction<IStrategy>) => {
      state.selectedStrategyIndex = state.indexBySlug[action.payload.slug];
    },
    selectGroup: (state, action: PayloadAction<IStrategy[]>) => {
      state.selectedStrategyGroup = action.payload.map(
        (strategy) => strategy.slug
      );
      state.selectedStrategyIndex =
        state.indexBySlug[state.selectedStrategyGroup[0]];
    },
    updateStrategiesPrices: (state, action: PayloadAction<CoinGeckoPrices>) => {
      state.list.forEach((strategy) => {
        const price =
          action.payload[strategy.asset.coinGeckoId].usd *
          (strategy.sharePrice / strategy.weiPerUnit);
        strategy.sharePriceUsd = price;
        strategy.tvlUsd = price * strategy.tvl;
      });
      state.strategiesBalances.forEach((balance) => {
        const strategy = Strategy.bySlug[balance.token];
        if (strategy) {
          balance.amountUsd = balance.amount * strategy.sharePriceUsd;
        }
      });
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
      state.strategiesBalances = action.payload.map((balance) => {
        const strategy = Strategy.bySlug[balance.token];
        if (strategy) {
          balance.amountUsd = balance.amount * strategy.sharePriceUsd;
        }
        return balance;
      });
    });
  },
});

export const {
  init,
  select,
  selectGroup,
  search,
  filterByNetworks,
  updateStrategiesPrices,
} = strategiesSlice.actions;

export const StrategiesReducer = strategiesSlice.reducer;
