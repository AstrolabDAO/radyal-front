import axios from "axios";
import { COINGECKO_API, DeFI_API } from "./constants";
import {
  coingeckoIdBySymbol,
  deFiIdByChainId,
  tokenBySlug,
  tokenBySymbol,
  tokenPriceByCoingeckoId,
} from "./mappings";
import { DeFiBalance, Network, Token } from "./interfaces";

export const getBalancesFromDeFI = (
  address: `0x${string}`,
  network: Network
) => {
  return axios
    .get(
      `${DeFI_API}/balances?addresses[]=${address}&chains[]=${
        deFiIdByChainId[network.id]
      }`
    )
    .then((res) => res.data)
    .then((data) => {
      const tokens = data[address].tokens;
      return tokens
        .filter(({ amount }) => {
          const convertedAmount = BigInt(amount);
          return convertedAmount > 0;
        })
        .map(({ amount, token: apiToken }: DeFiBalance) => {
          const token: Token = {
            address: apiToken.address,
            symbol: apiToken.symbol,
            decimals: apiToken.decimals,
            coingeckoId: apiToken.coingeckoId,
            icon: `/tokens/${apiToken.symbol}.svg`,
            slug: `${network.slug}:${apiToken.symbol}`,
            network,
            amount,
          };

          tokenBySlug[token.slug] = token;
          tokenBySymbol[token.symbol] = token;
          coingeckoIdBySymbol[token.symbol];
          return token;
        });
    });
};

export const getTokenPrice = (token: Token) => {
  return axios.get(`${COINGECKO_API}/simple/price`, {
    params: {
      ids: token.coingeckoId,
      vs_currencies: "usd",
    },
  });
};
export const getTokensPrices = async (tokens: Token[]) => {
  const tokensIds = new Set(tokens.map((token) => token.coingeckoId));

  return axios
    .get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: Array.from(tokensIds).join(","),
        vs_currencies: "usd",
      },
    })
    .then((data) => data.data);
};

export const updateTokenPrices = async (tokens: Token[]) => {
  const prices = await getTokensPrices(tokens);
  const keys = Object.keys(prices);

  Object.values(prices).map((price, index) => {
    const key = keys[index];
    tokenPriceByCoingeckoId[key] = price as any;
  });
  return tokenPriceByCoingeckoId;
};
