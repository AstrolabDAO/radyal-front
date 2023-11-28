import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { updateTokenPrices } from "~/utils/api";
import { TOKEN_BASENAME_REGEX } from "~/utils/constants";
import { CoingeckoPrices, Token, TokenBySlugMapping } from "~/utils/interfaces";
import {
  networkBySlug,
  tokenBySlug as tokenBySlugMapping,
} from "~/utils/mappings";

interface TokensContextType {
  tokens: Token[];
  tokenPrices: CoingeckoPrices;
  tokensBySlug?: TokenBySlugMapping;
  tokensIsLoaded: boolean;
  updateTokens: (tokens: Token[]) => void;
  updatePrices: (prices: CoingeckoPrices) => void;
  updateTokenBySlug: (token: Token) => void;
  refreshTokenBySlugs: () => void;
  tokenBySlug: (slug: string) => Token;
}

export const TokensContext = createContext<TokensContextType>({
  tokens: [],
  tokenPrices: {},
  tokensBySlug: {},
  tokensIsLoaded: false,
  updateTokens: () => {},
  updatePrices: () => {},
  updateTokenBySlug: () => {},
  refreshTokenBySlugs: () => {},
  tokenBySlug: (): any => {},
});

export const TokensProvider = ({ children }) => {
  const now = new Date().getTime();
  const localTokenPrices = localStorage.getItem("token-prices");
  const localPricesExpiry = Number(localStorage.getItem("pricesExpiry"));

  const basePrices =
    localTokenPrices === null || now > localPricesExpiry + 60 * 1000 * 10
      ? (JSON.parse(localTokenPrices) as CoingeckoPrices)
      : {};

  const [tokens, setTokens] = useState([]);
  const [tokensBySlug, setTokensBySlugs] = useState<TokenBySlugMapping>({});
  const [tokensIsLoaded, setTokensIsLoaded] = useState(false);
  const [tokenPrices, setTokenPrices] = useState(basePrices);

  useEffect(() => {
    axios
      .get(`${process.env.ASTROLAB_API}/tokens`)
      .then((res) => res.data.data)
      .then((tokens) => {
        const filteredTokens = tokens
          .filter((token) => {
            const { nativeNetwork } = token;
            const network = networkBySlug[nativeNetwork];
            if (!network) return false;
            token.network = network;
            return true;
          })
          .map(({ nativeAddress, symbol, network, scale, coinGeckoId }) => {
            const cleanSymbol = symbol.replace(TOKEN_BASENAME_REGEX, "$1");
            const token = {
              address: nativeAddress,
              symbol,
              decimals: scale,
              icon: `/tokens/${cleanSymbol.toLowerCase()}.svg`,
              network,
              slug: `${network.slug}:${symbol.toLocaleLowerCase()}`,
              coinGeckoId,
            } as Token;
            return token;
          });

        setTokens(filteredTokens);
        if (Object.values(tokenPrices).length === 0) {
          updateTokenPrices(filteredTokens)
            .then((prices) => {
              updatePrices(prices);
            })
            .catch(console.error);
        }
        setTokensIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    tokens.forEach((token) => {
      updateTokenBySlug(token);
    });
  }, [tokens]);

  const updateTokens = (tokens: Token[]) => {
    setTokens(tokens);
  };

  const updatePrices = (prices: CoingeckoPrices) => {
    localStorage.setItem("token-prices", JSON.stringify(prices));
    localStorage.setItem("pricesExpiry", now + (60 * 1000).toString());

    setTokenPrices(prices);
  };
  const updateTokenBySlug = (token: Token) => {
    tokenBySlugMapping[token.slug] = token;
    setTokensBySlugs({ ...tokenBySlugMapping });
  };

  const tokenBySlug = (slug: string) => {
    return tokensBySlug[slug];
  };

  const refreshTokenBySlugs = () => {
    setTokensBySlugs({ ...tokenBySlugMapping });
  };

  return (
    <TokensContext.Provider
      value={{
        tokens,
        tokenPrices,
        tokensBySlug,
        tokensIsLoaded,
        updateTokens,
        updatePrices,
        updateTokenBySlug,
        refreshTokenBySlugs,
        tokenBySlug,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};
