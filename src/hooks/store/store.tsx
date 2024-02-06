import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { ONE_MINUTE } from "~/main";
import {
  init,
  setBalances,
  setRequestedPriceCoingeckoIds,
  setTokenPrices,
} from "~/store/tokens";
import { getTokens, getTokensPrices, loadBalancesByAddress } from "~/utils/api";
import { cacheHash } from "~/utils/format";
import { Balance, Token } from "~/utils/interfaces";
import { useRequestedPriceCoingeckoIds } from "./tokens";

let STORE_IS_INIT = false;
let STORE_IS_PARTIAL_INIT = false;
export const useReduxStoreDataInit = () => {
  const tokens = useLoadTokens();
  const dispatch = useDispatch();
  const { isConnected } = useAccount();

  const balances = useLoadBalances();
  const prices = useLoadPrices(tokens, balances);

  useEffect(() => {
    if (STORE_IS_INIT) return;
    if (tokens && !isConnected && !STORE_IS_PARTIAL_INIT) {
      STORE_IS_PARTIAL_INIT = true;

      dispatch(
        init({
          tokens,
        })
      );
      return;
    } else if (!tokens || !balances || !prices) return;
    STORE_IS_INIT = true;
    dispatch(init({ tokens, balances, prices }));
  }, [tokens, balances, prices, dispatch, isConnected]);

  useEffect(() => {
    if (!STORE_IS_INIT || !balances) return;
    dispatch(setBalances(balances));
  }, [balances, dispatch]);

  useEffect(() => {
    if (!STORE_IS_INIT || !prices) return;
    dispatch(setTokenPrices(prices));
  }, [dispatch, prices]);
};
export const useLoadTokens = () => {
  const { data: tokens, isLoading } = useQuery<Token[]>("tokens", getTokens, {
    //staleTime: 0,
    //cacheTime: 0,
    retry: true,
  });
  const dispatch = useDispatch();

  return !isLoading ? tokens : null;
};

export const useLoadBalances = () => {
  const { address, isConnected } = useAccount();

  const { data: balances, isLoading } = useQuery<Balance[]>(
    cacheHash(`balances`, address),
    () => loadBalancesByAddress(address),
    {
      enabled: !!address && isConnected,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

  return !isConnected || isLoading ? null : balances;
};
export const useLoadPrices = (tokens: Token[], balances: Balance[]) => {
  const storedCoingeckoIds = useRequestedPriceCoingeckoIds();
  const dispatch = useDispatch();
  const [coingeckoIds, enable] = useMemo(() => {
    if (!tokens || !balances) return [[], false];
    const coingeckoIds = balances
      .filter((balance) => {
        const token = tokens.find((token) => token.slug === balance.token);
        return !!token;
      })
      .map((balance) => {
        const token = tokens.find((token) => token.slug === balance.token);
        return token?.coinGeckoId;
      });

    return [coingeckoIds, true];
  }, [tokens, balances]);

  const { data: prices, isLoading } = useQuery(
    cacheHash("prices"),
    () => {
      const uniqueIds = new Set<string>([
        ...storedCoingeckoIds,
        ...coingeckoIds,
      ]);

      return getTokensPrices(Array.from(uniqueIds));
    },
    {
      enabled: enable,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );
  useEffect(() => {
    dispatch(setRequestedPriceCoingeckoIds(coingeckoIds));
  }, [coingeckoIds, dispatch]);

  return !isLoading ? prices : null;
};
