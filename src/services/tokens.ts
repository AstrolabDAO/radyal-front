import { getStoreState } from "~/store";
import {
  requestedPriceCoingeckoIdsSelector,
  sortedBalancesSelector,
} from "~/store/selectors/tokens";

export const getTokensStore = () => {
  return getStoreState().tokens;
};

export const getTokens = () => {
  return getTokensStore().list;
};

export const getTokenBySlug = (slug: string) => {
  return getTokensStore().mappings.tokenBySlug[slug];
};

export const getBalances = () => {
  return sortedBalancesSelector(getStoreState());
};

export const getBalanceByTokenSlug = (slug: string) => {
  return getTokensStore().mappings.balanceByTokenSlug[slug];
};

export const getPrices = () => {
  return getTokensStore().prices;
};

export const getRequestedPriceCoingeckoIds = () => {
  return requestedPriceCoingeckoIdsSelector(getStoreState());
};
