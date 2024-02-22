import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { ONE_MINUTE } from "~/App";
import { useRequestedPriceCoingeckoIds } from "~/hooks/tokens";

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

  const { data: tokens } = useQuery<Token[]>({
    queryKey: ["tokens"],
    queryFn: getTokens,
    retry: true,
  });

  const { data: balances } = useQuery<Balance[]>({
    queryKey: [cacheHash(`balances`, address)],
    queryFn: () => loadBalancesByAddress(address),
    enabled: !!address && isConnected,
    staleTime: ONE_MINUTE,
    refetchInterval: ONE_MINUTE,
  });

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

  const { data: prices } = useQuery({
    queryKey: [cacheHash("prices")],
    queryFn: () => {
      const uniqueIds = new Set<string>([
        ...storedCoingeckoIds,
        ...coingeckoIds,
      ]);

      return getTokensPrices(Array.from(uniqueIds));
    },
    enabled: enable,
    staleTime: ONE_MINUTE,
    refetchInterval: ONE_MINUTE,
  });

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
