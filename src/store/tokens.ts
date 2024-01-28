import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cacheHash } from "~/utils/format";

import {
  Balance,
  CoingeckoPrices,
  Token,
  TokenBySlugMapping,
} from "~/utils/interfaces";

export const CACHE_KEY = cacheHash("tokens");

export interface TokensState {
  list: Token[];
  balances: Balance[];
  prices: CoingeckoPrices;
  requestedPriceCoingeckoIds: string[];
  tokenLoaded: boolean;
  canLoadPrices: boolean;
  mappings: {
    tokenBySlug: TokenBySlugMapping;
    tokenBySymbol: { [symbol: string]: Token };
    tokensByNetworkId: { [networkId: number]: Token[] };
    tokensByNetworkSlug: { [networkSlug: string]: Token[] };
    coinGeckoIdBySymbol: { [symbol: string]: string };
    balanceByTokenSlug: { [slug: string]: Balance };
  };
}

const updateMappings = (state: TokensState) => {
  state.mappings.tokenBySlug = {};
  state.mappings.tokenBySymbol = {};
  state.mappings.tokensByNetworkId = {};
  state.mappings.tokensByNetworkSlug = {};
  state.mappings.coinGeckoIdBySymbol = {};

  state.list.forEach((token) => {
    state.mappings.tokenBySlug[token.slug] = token;
    state.mappings.tokenBySymbol[token.symbol] = token;
    state.mappings.coinGeckoIdBySymbol[token.symbol] = token.coinGeckoId;
    if (!state.mappings.tokensByNetworkId[token.network.id])
      state.mappings.tokensByNetworkId[token.network.id] = [];
    if (!state.mappings.tokensByNetworkSlug[token.network.slug])
      state.mappings.tokensByNetworkSlug[token.network.slug] = [];

    state.mappings.tokensByNetworkSlug[token.network.slug].push(token);
    state.mappings.tokensByNetworkId[token.network.id].push(token);
  });
};

const initialState: TokensState = {
  list: [],
  balances: [],
  prices: {},
  tokenLoaded: false,
  canLoadPrices: false,
  requestedPriceCoingeckoIds: [],
  mappings: {
    tokenBySlug: {},
    tokenBySymbol: {},
    tokensByNetworkId: {},
    tokensByNetworkSlug: {},
    coinGeckoIdBySymbol: {},
    balanceByTokenSlug: {},
  },
};

interface InitPayload {
  tokens: Token[];
  balances?: Balance[];
  prices?: CoingeckoPrices;
}
const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<InitPayload>) => {
      if (!state.tokenLoaded) {
        state.list = action.payload.tokens;
        state.tokenLoaded = true;
        updateMappings(state);
      }

      if (action.payload.balances) {
        state.balances = Object.values(action.payload.balances);
        state.balances.forEach((balance) => {
          state.mappings.balanceByTokenSlug[balance.token] = balance;
        });
      }
      if (action.payload.prices) {
        state.prices = action.payload.prices;
      }
    },
    setBalances: (state, action: PayloadAction<Balance[]>) => {
      state.balances = Object.values(action.payload);
      state.balances.forEach((balance) => {
        state.mappings.balanceByTokenSlug[balance.token] = balance;
      });
    },
    setTokenPrices: (state, action: PayloadAction<CoingeckoPrices>) => {
      state.prices = action.payload;
    },
    addToken: (state, action: PayloadAction<Token>) => {
      state.list.push(action.payload);
    },
    addBalance: (state, action: PayloadAction<Balance>) => {
      if (!state.mappings.balanceByTokenSlug[action.payload.token])
        state.balances.push(action.payload);
    },
    setRequestedPriceCoingeckoIds: (state, action: PayloadAction<string[]>) => {
      state.requestedPriceCoingeckoIds = Object.values(action.payload);
    },
    addRequestedPriceCoingeckoId: (
      state,
      action: PayloadAction<{ coingeckoId: string }>
    ) => {
      const set = new Set(state.requestedPriceCoingeckoIds).add(
        action.payload.coingeckoId
      );
      state.requestedPriceCoingeckoIds = Array.from(set);
    },
    tokensIsLoaded: (state) => {
      state.tokenLoaded = true;
    },
    canLoadPrices: (state) => {
      state.canLoadPrices = true;
    },
    updatePrices: (state, action: PayloadAction<CoingeckoPrices>) => {
      state.prices = action.payload;
    },
    updateMappings: (state) => {
      updateMappings(state);
    },
  },
});

export const {
  init,
  setBalances,
  setTokenPrices,
  setRequestedPriceCoingeckoIds,
  addRequestedPriceCoingeckoId,
  addToken,
  tokensIsLoaded,
  canLoadPrices,
  addBalance,
  updatePrices,
} = tokensSlice.actions;

export const TokenReducer = tokensSlice.reducer;
