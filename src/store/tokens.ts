import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cacheHash } from "~/utils/format";

import {
  Balance,
  CoinGeckoPrices,
  Token,
  TokenBySlugMapping,
} from "~/utils/interfaces";

export const CACHE_KEY = cacheHash("tokens");

export interface TokensState {
  list: Token[];
  balances: Balance[];
  prices: CoinGeckoPrices;
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

const updateMappings = (state: TokensState, token: Token) => {
  state.mappings.tokenBySlug[token.slug] = token;
  state.mappings.tokenBySymbol[token.symbol] = token;
  state.mappings.coinGeckoIdBySymbol[token.symbol] = token.coinGeckoId;
  if (!state.mappings.tokensByNetworkId[token.network.id])
    state.mappings.tokensByNetworkId[token.network.id] = [];
  if (!state.mappings.tokensByNetworkSlug[token.network.slug])
    state.mappings.tokensByNetworkSlug[token.network.slug] = [];

  state.mappings.tokensByNetworkSlug[token.network.slug].push(token);
  state.mappings.tokensByNetworkId[token.network.id].push(token);
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
  prices?: CoinGeckoPrices;
}
const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<InitPayload>) => {
      if (!state.tokenLoaded) {
        state.list = action.payload.tokens;
        state.tokenLoaded = true;
        state.list.map((token) => {
          updateMappings(state, token);
        });
      }

      if (action.payload.balances) {
        state.balances = action.payload.balances;
        state.balances.forEach((balance) => {
          state.mappings.balanceByTokenSlug[balance.token] = balance;
        });
      }
      if (action.payload.prices) {
        state.prices = action.payload.prices;
      }
    },
    setBalances: (state, action: PayloadAction<Balance[]>) => {
      state.balances = action.payload;
      state.balances.forEach((balance) => {
        state.mappings.balanceByTokenSlug[balance.token] = balance;
      });
    },
    setTokenPrices: (state, action: PayloadAction<CoinGeckoPrices>) => {
      state.prices = action.payload;
    },
    addToken: (state, action: PayloadAction<Token>) => {
      if (state.mappings.tokenBySlug[action.payload.slug]) return;
      state.list.push(action.payload);
      updateMappings(state, action.payload);
    },
    addTokens: (state, action: PayloadAction<Token[]>) => {
      const tokens = action.payload.filter(
        (token) => !state.mappings.tokenBySlug[token.slug]
      );
      state.list.push(...tokens);
      tokens.forEach((token) => {
        updateMappings(state, token);
      });
    },
    addBalance: (state, action: PayloadAction<Balance>) => {
      if (!state.mappings.balanceByTokenSlug[action.payload.token])
        state.balances.push(action.payload);
      else
        state.balances = state.balances.map((balance) =>
          balance.token === action.payload.token ? action.payload : balance
        );
    },
    addBalances: (state, action: PayloadAction<Balance[]>) => {
      const balances = action.payload.filter(
        (balance) => !state.mappings.balanceByTokenSlug[balance.token]
      );
      state.balances.push(...balances);
      balances.forEach((balance) => {
        state.mappings.balanceByTokenSlug[balance.token] = balance;
      });
    },
    setRequestedPriceCoingeckoIds: (state, action: PayloadAction<string[]>) => {
      state.requestedPriceCoingeckoIds = action.payload;
    },
    addRequestedPriceCoingeckoId: (state, action: PayloadAction<string>) => {
      const set = new Set(state.requestedPriceCoingeckoIds).add(action.payload);
      state.requestedPriceCoingeckoIds = Array.from(set);
    },
    addRequestedPriceCoingeckoIds: (state, action: PayloadAction<string[]>) => {
      const ids = [...state.requestedPriceCoingeckoIds];
      ids.push(...action.payload);
      state.requestedPriceCoingeckoIds = Array.from(new Set(ids));
    },
    tokensIsLoaded: (state) => {
      state.tokenLoaded = true;
    },
    canLoadPrices: (state) => {
      state.canLoadPrices = true;
    },
    updatePrices: (state, action: PayloadAction<CoinGeckoPrices>) => {
      state.prices = action.payload;
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
  addTokens,
  tokensIsLoaded,
  canLoadPrices,
  addBalance,
  addBalances,
  updatePrices,
} = tokensSlice.actions;

export const TokenReducer = tokensSlice.reducer;
