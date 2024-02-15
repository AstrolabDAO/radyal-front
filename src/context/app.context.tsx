import { createContext, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { useRequestedPriceCoingeckoIds } from "~/hooks/tokens";
import { ONE_MINUTE } from "~/main";
import { dispatch } from "~/store";
import {
  init,
  setBalances,
  setRequestedPriceCoingeckoIds,
} from "~/store/tokens";
import { getTokens, getTokensPrices, loadBalancesByAddress } from "~/utils/api";
import { cacheHash } from "~/utils/format";
import { Balance, Token } from "~/utils/interfaces";

let STORE_IS_INIT = false;
let STORE_IS_PARTIAL_INIT = false;

const AppContext = createContext({});

const AppProvider = () => {
  const storedCoingeckoIds = useRequestedPriceCoingeckoIds();
  const { address, isConnected } = useAccount();
  const { data: tokens, isLoading: tokenIsLoading } = useQuery<Token[]>(
    "tokens",
    getTokens,
    {
      retry: true,
    }
  );
  const { data: balances, isLoading: balancesIsLoading } = useQuery<Balance[]>(
    cacheHash(`balances`, address),
    () => loadBalancesByAddress(address),
    {
      enabled: !!address && isConnected,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

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

  const { data: prices, isLoading: pricesIsLoading } = useQuery(
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
    if (!STORE_IS_INIT || !balances) return;
    dispatch(setBalances(balances));
  });
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
    dispatch(setRequestedPriceCoingeckoIds(coingeckoIds));
  }, [coingeckoIds, dispatch]);
  return <AppContext.Provider value={{}}></AppContext.Provider>;
};

export { AppProvider, AppContext };
