import axios from "axios";
import { COINGECKO_API, DeFI_API } from "./constants";
import { Balance, DeFiBalance, Network, Token } from "./interfaces";
import { deFiIdByChainId, tokenPriceBycoinGeckoId } from "./mappings";

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
          /*
          const cleanSymbol = apiToken.symbol.replace(
            TOKEN_BASENAME_REGEX,
            "$1"
          );
          const token: Token = {
            address: apiToken.address,
            symbol: apiToken.symbol,
            name: apiToken.name,
            decimals: apiToken.decimals,
            coinGeckoId: apiToken.coinGeckoId,
            icon: `/tokens/${cleanSymbol.toLowerCase()}.svg`,
            slug: `${network.slug}:${apiToken.symbol}`,
            network,
          };
          */
          const balance: Balance = {
            slug: `${network.slug}:${apiToken.symbol.toLowerCase()}`,
            amount,
          };

          return balance;
        });
    });
};

export const getTokenPrice = (token: Token) => {
  return axios.get(`${COINGECKO_API}/simple/price`, {
    params: {
      ids: token.coinGeckoId,
      vs_currencies: "usd",
    },
  });
};
export const getTokensPrices = async (tokens: Token[]) => {
  console.log("🚀 ~ file: api.ts:60 ~ getTokensPrices ~ tokens:", tokens);
  const tokensIds = new Set(tokens.map((token) => token.coinGeckoId));
  console.log("🚀 ~ file: api.ts:61 ~ getTokensPrices ~ tokensIds:", tokensIds);

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
    tokenPriceBycoinGeckoId[key] = price as any;
  });
  return tokenPriceBycoinGeckoId;
};
