import { createContext, useEffect, useState } from "react";
import { CoingeckoPrices, Token, TokenBySlugMapping } from "~/utils/interfaces";
import { tokenBySlug as tokenBySlugMapping } from "~/utils/mappings";

interface TokensContextType {
  tokens: Token[];
  tokenPrices: CoingeckoPrices;
  updateTokens: (tokens: Token[]) => void;
  updatePrices: (prices: CoingeckoPrices) => void;
  updateTokenBySlug: (slug: string, token: Token) => void;
  refreshTokenBySlugs: () => void;
  tokenBySlug: (slug: string) => Token;
}

export const TokensContext = createContext<TokensContextType>({
  tokens: [],
  tokenPrices: {},
  updateTokens: () => {},
  updatePrices: () => {},
  updateTokenBySlug: () => {},
  refreshTokenBySlugs: () => {},
  tokenBySlug: (): any => {},
});

export const TokensProvider = ({ children }) => {
  const localTokenPrices = localStorage.getItem("token-prices");
  const Provider = TokensContext.Provider;
  const [tokens, setTokens] = useState([]);
  const [tokenBySlug, setTokenBySlugs] = useState<TokenBySlugMapping>({});

  const [tokenPrices, setTokenPrices] = useState(
    localTokenPrices ? (JSON.parse(localTokenPrices) as CoingeckoPrices) : {}
  );

  useEffect(() => {}, []);

  const updateTokens = (tokens: Token[]) => {
    setTokens(tokens);
  };

  const updatePrices = (prices: CoingeckoPrices) => {
    localStorage.setItem("token-prices", JSON.stringify(prices));
    setTokenPrices(prices);
  };
  const updateTokenBySlug = (slug: string, token: Token) => {
    tokenBySlugMapping[slug] = token;
    setTokenBySlugs({ ...tokenBySlugMapping });
  };

  const tokenBySlugGetter = (slug: string) => {
    return tokenBySlug[slug];
  };

  const refreshTokenBySlugs = () => {
    setTokenBySlugs({ ...tokenBySlugMapping });
  };

  return (
    <Provider
      value={{
        tokens,
        updateTokens,
        tokenPrices,
        updatePrices,
        updateTokenBySlug,
        refreshTokenBySlugs,
        tokenBySlug: tokenBySlugGetter,
      }}
    >
      {children}
    </Provider>
  );
};
