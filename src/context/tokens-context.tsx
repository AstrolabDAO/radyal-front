import { createContext, useCallback, useEffect, useState } from "react";

import { getTokens, getTokensPrices } from "~/utils/api";
import { CoingeckoPrices, Token, TokenBySlugMapping } from "~/utils/interfaces";
import { tokenBySlug as tokenBySlugMapping } from "~/utils/mappings";

import { useQuery } from "react-query";
import { ONE_MINUTE } from "~/main";

interface TokensContextType {
  tokens: Token[];
  tokenPrices: CoingeckoPrices;
  tokensBySlug?: TokenBySlugMapping;
  tokensIsLoaded: boolean;
  updateTokenBySlug: (token: Token) => void;
  refreshTokenBySlugs: () => void;
  tokenBySlug: (slug: string) => Token;
}

export const TokensContext = createContext<TokensContextType>({
  tokens: [],
  tokenPrices: {},
  tokensBySlug: {},
  tokensIsLoaded: false,
  updateTokenBySlug: () => {},
  refreshTokenBySlugs: () => {},
  tokenBySlug: (): any => {},
});

export const TokensProvider = ({ children }) => {
  const [tokensBySlug, setTokensBySlugs] = useState<TokenBySlugMapping>({});
  const updateTokenBySlug = useCallback((token: Token) => {
    tokenBySlugMapping[token.slug] = token;
    setTokensBySlugs({ ...tokenBySlugMapping });
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

  const { data: tokens, isLoading } = useQuery("tokens", getTokens);

  const { data: tokenPrices } = useQuery(
    "prices",
    () => getTokensPrices(tokens),
    {
      enabled: !!tokens,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

  useEffect(() => {
    tokens?.forEach((token) => {
      updateTokenBySlug(token);
    });
  }, [tokens, updateTokenBySlug]);

  return (
    <TokensContext.Provider
      value={{
        tokens,
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
