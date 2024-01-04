import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getTokens, getTokensPrices, loadBalancesByAddress } from "~/utils/api";
import {
  Balance,
  BalanceBySlugMapping,
  CoingeckoPrices,
  Token,
  TokenBySlugMapping,
} from "~/utils/interfaces";
import {
  tokenBySlug as tokenBySlugMapping,
  updateTokenMapping,
  updateBalanceMapping,
  balanceBySlug as balanceBySlugMapping,
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
  tokensBySlug?: TokenBySlugMapping;
  tokensIsLoaded: boolean;
  updateTokenBySlug: (token: Token) => void;
  refreshTokenBySlugs: () => void;
  tokenBySlug: (slug: string) => Token;
}

export const TokensContext = createContext<TokensContextType>({
  tokens: [],
  balances: [],
  sortedBalances: [],
  tokenPrices: {},
  tokensBySlug: {},
  tokensIsLoaded: false,
  updateTokenBySlug: () => {},
  refreshTokenBySlugs: () => {},
  tokenBySlug: (): any => {},
});

export const TokensProvider = ({ children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const [balances, setBalances] = useState<Balance[]>([]);
  const [loadPrices, setLoadPrices] = useState<boolean>(false);
  const [canLoadBalances, setCanLoadBalances] = useState<boolean>(false);
  const [tokensBySlug, setTokensBySlugs] = useState<TokenBySlugMapping>({});
  const [balancesBySlug, setBalancesBySlug] = useState<BalanceBySlugMapping>(
    {}
  );

  const { address, isConnected } = useAccount();

  const updateTokenBySlug = useCallback((token: Token) => {
    tokenBySlugMapping[token.slug] = token;
  }, []);

  const tokenBySlug = useCallback(
    (slug: string) => {
      return tokensBySlug[slug];
    },
    [tokensBySlug]
  );

  const refreshTokenBySlugs = useCallback(() => {
    setTokensBySlugs({ ...tokenBySlugMapping });
  }, []);

  const { data: tokensData, isLoading } = useQuery("tokens", getTokens);

  useEffect(() => {
    tokensData?.forEach((token) => updateTokenMapping(token));
    setTokens(tokensData);
    setTokensBySlugs({ ...tokenBySlugMapping });
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
    () => getTokensPrices(tokens),
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

    balancesData?.forEach(([balance, token]) => {
      if (token && !tokenBySlugMapping[token.slug]) {
        updateTokenMapping(token);
        _tokens.push(token);
      }
      _balances.push(balance);
    });

    setTokensBySlugs({ ...tokenBySlugMapping });

    setTokens(_tokens);
    setBalances(_balances);
    setLoadPrices(true);
  }, [balancesData, tokensData, tokens, address]);

  const sortedBalances = useMemo(() => {
    if (!tokenPrices || Object.values(tokenBySlugMapping).length === 0)
      return [];

    return balances
      .filter((balance) => {
        const token = tokenBySlugMapping[balance.slug];

        const price = tokenPrices[token?.coinGeckoId]?.usd;

        if (!price) {
          return false;
        }
        const value = amountToEth(BigInt(balance.amount), token?.decimals);
        return value * price > 1;
      })
      .sort((a, b) => {
        const tokenA = tokenBySlugMapping[a.slug];
        const tokenB = tokenBySlugMapping[b.slug];

        const priceA = tokenPrices[tokenA?.coinGeckoId]?.usd;
        const priceB = tokenPrices[tokenB?.coinGeckoId]?.usd;

        const valueA = amountToEth(BigInt(a.amount), tokenA?.decimals) * priceA;
        const valueB = amountToEth(BigInt(b.amount), tokenB?.decimals) * priceB;

        return valueA > valueB ? -1 : 1;
      });
  }, [balances, tokenPrices]);

  useEffect(() => {
    balances.forEach((balance) => updateBalanceMapping(balance));
    setBalancesBySlug(balanceBySlugMapping);
  }, [balances]);

  return (
    <TokensContext.Provider
      value={{
        tokens,
        balances,
        sortedBalances,
        tokenPrices,
        tokensBySlug,
        tokensIsLoaded: !isLoading,
        updateTokenBySlug,
        refreshTokenBySlugs,
        tokenBySlug,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};
