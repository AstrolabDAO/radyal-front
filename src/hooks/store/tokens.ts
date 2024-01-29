import { useSelector } from "react-redux";
import { IRootState } from "~/store";
import { sortedBalancesSelector } from "~/store/selectors/tokens";
import { Token } from "~/utils/interfaces";

export const useTokensStore = () => {
  return useSelector((state: IRootState) => state.tokens);
};
export const useTokens = (): Token[] => {
  return useSelector((state: IRootState) => state.tokens.list);
};
export const useTokenBySlug = () => {
  return useSelector((state: IRootState) => state.tokens.mappings.tokenBySlug);
};

export const useTokenIsLoaded = () => {
  return useSelector((state: IRootState) => state.tokens.tokenLoaded);
};
export const useBalances = () => {
  return useSelector(sortedBalancesSelector);
};

export const useBalanceByTokenSlug = () => {
  return useSelector(
    (state: IRootState) => state.tokens.mappings.balanceByTokenSlug
  );
};

export const useCanLoadPrices = () => {
  return useSelector((state: IRootState) => state.tokens.canLoadPrices);
};
export const usePrices = () => {
  return useSelector((state: IRootState) => state.tokens.prices);
};

export const useRequestedPriceCoingeckoIds = () => {
  return useSelector(
    (state: IRootState) => state.tokens.requestedPriceCoingeckoIds
  );
};
