import { createContext, useEffect, useMemo, useState } from "react";

import { getTokens, getTokensPrices, loadBalancesByAddress } from "~/utils/api";
import { Balance, CoingeckoPrices, Token } from "~/utils/interfaces";
import {
  updateTokenMapping,
  updateBalanceMapping,
  tokensBySlugForPriceAPI,
  tokenBySlug,
} from "~/utils/mappings";

import { useQuery } from "react-query";
import { ONE_MINUTE } from "~/main";
import { useAccount } from "wagmi";
import { amountToEth } from "~/utils/format";

interface TokensContextType {
  tokens: Token[];
  balances: Balance[];
  sortedBalances: Balance[];
  tokenPrices: CoingeckoPrices;
  tokensIsLoaded: boolean;
}

export const TokensContext = createContext<TokensContextType>({
  tokens: [],
  balances: [],
  sortedBalances: [],
  tokenPrices: {},
  tokensIsLoaded: false,
});

export const TokensProvider = ({ children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const [balances, setBalances] = useState<Balance[]>([]);
  const [loadPrices, setLoadPrices] = useState<boolean>(false);

  const [canLoadBalances, setCanLoadBalances] = useState<boolean>(false);

  const { address, isConnected } = useAccount();

  const { data: tokensData, isLoading } = useQuery("tokens", getTokens);

  useEffect(() => {
    tokensData?.forEach((token) => updateTokenMapping(token));
    setTokens(tokensData);
    setCanLoadBalances(true);
  }, [tokensData]);

  const { data: balancesData } = useQuery(
    `balances-${address}`,
    () => loadBalancesByAddress(address),
    {
      enabled: !!address && !isLoading && isConnected && canLoadBalances,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

  const { data: tokenPrices } = useQuery(
    "prices",

    () => {
      return getTokensPrices(Object.values(tokensBySlugForPriceAPI));
    },
    {
      enabled: !!tokens && loadPrices,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

  useEffect(() => {
    if (!balancesData || !tokensData) return;

    const _tokens = tokensData;

    const _balances = [];

    setBalances(_balances);

    balancesData?.forEach((data) => {
      const [balance, token] = data;
      const _token = token ?? tokenBySlug[balance.slug];
      if (token && !tokenBySlug[token.slug]) {
        updateTokenMapping(token);
        _tokens.push(token);
      }
      tokensBySlugForPriceAPI[_token.slug] = _token;
      _balances.push(balance);
    });

    setTokens(_tokens);
    setBalances(_balances);
    setLoadPrices(true);
  }, [balancesData, tokensData, tokens, address]);

  const sortedBalances = useMemo(() => {
    if (!tokenPrices || Object.values(tokenBySlug).length === 0) return [];

    return balances
      .filter((balance) => {
        const token = tokenBySlug[balance.slug];

        const price = tokenPrices[token?.coinGeckoId]?.usd;

        if (!price) {
          return false;
        }
        const value = amountToEth(BigInt(balance.amount), token?.decimals);
        return value * price > 1;
      })
      .sort((a, b) => {
        const tokenA = tokenBySlug[a.slug];
        const tokenB = tokenBySlug[b.slug];

        const priceA = tokenPrices[tokenA?.coinGeckoId]?.usd;
        const priceB = tokenPrices[tokenB?.coinGeckoId]?.usd;

        const valueA = amountToEth(BigInt(a.amount), tokenA?.decimals) * priceA;
        const valueB = amountToEth(BigInt(b.amount), tokenB?.decimals) * priceB;

        return valueA > valueB ? -1 : 1;
      });
  }, [balances, tokenPrices]);

  useEffect(() => {
    balances.forEach((balance) => updateBalanceMapping(balance));
  }, [balances]);

  return (
    <TokensContext.Provider
      value={{
        tokens,
        balances,
        sortedBalances,
        tokenPrices,
        tokensIsLoaded: !isLoading,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};
