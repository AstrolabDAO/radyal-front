import { createSelector } from "@reduxjs/toolkit";
import { IRootState } from "..";

import { TokensState } from "../tokens";
import { amountToEth } from "~/utils/format";

const selectTokensState = (state: IRootState) => state.tokens;
const selectMappings = (state: IRootState) => state.tokens.mappings;

export const createTokenBySlugSelector = (slug: string) =>
  createSelector(selectMappings, (mappings) => {
    return mappings.tokenBySlug[slug];
  });

export const requestedPriceCoingeckoIdsSelector = createSelector(
  selectTokensState,
  (state: TokensState) => state.requestedPriceCoingeckoIds
);

export const sortedBalancesSelector = createSelector(
  selectTokensState,
  (state: TokensState) => {
    return state.balances
      .filter((balance) => {
        const token = state.mappings.tokenBySlug[balance.token];

        const price = state.prices[token?.coinGeckoId]?.usd;

        if (!price) {
          return false;
        }
        const value = Number(balance.amountWei) / 10 ** token?.decimals;
        return value * price > 1;
      })
      .sort((a, b) => {
        const tokenA = state.mappings.tokenBySlug[a.token];

        const tokenB = state.mappings.tokenBySlug[b.token];

        const priceA = state.prices[tokenA?.coinGeckoId]?.usd;
        const priceB = state.prices[tokenB?.coinGeckoId]?.usd;

        const valueA =
          amountToEth(BigInt(a.amountWei), tokenA?.decimals) * priceA;
        const valueB =
          amountToEth(BigInt(b.amountWei), tokenB?.decimals) * priceB;

        return valueA > valueB ? -1 : 1;
      });
  }
);
