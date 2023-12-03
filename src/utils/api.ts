import { erc20Abi } from "abitype/abis";
import axios from "axios";
import { COINGECKO_API, DeFI_API, TOKEN_BASENAME_REGEX } from "./constants";
import { Balance, DeFiBalance, Network, Strategy, Token } from "./interfaces";
import {
  deFiIdByChainId,
  networkBySlug,
  tokenBySlug,
  tokenPriceBycoinGeckoId,
  tokensByNetworkSlug,
  updateTokenMapping,
} from "./mappings";
import updateBalances from "./multicall";
import { NETWORKS } from "./web3-constants";

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
        .map(({ amount, token: apiToken, token }: DeFiBalance) => {
          const balance: Balance = {
            slug: `${network.slug}:${apiToken.symbol.toLowerCase()}`,
            amount,
          };
          // TO DO -> MORE TO 1$
          const existingToken = tokenBySlug[balance.slug];
          if (!existingToken) {
            const _token = {
              address: token.address,
              name: token.name,
              decimals: token.decimals,
              coinGeckoId: token.coinGeckoId,
              icon: token.icon,
              network,
              symbol: token.symbol,
              slug: `${network.slug}:${token.symbol.toLowerCase()}`,
            } as Token;
            return [balance, _token];
          }

          return [balance, null];
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
  if (!tokens) return;
  const tokensIds = new Set(tokens.map((token) => token.coinGeckoId));

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

export const getTokens = async () => {
  return axios
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
          updateTokenMapping(token);
          return token;
        });

      return filteredTokens;
    });
};

export const getNetworks = async () => {
  return axios
    .get(`${process.env.ASTROLAB_API}/networks`)
    .then((result) => result.data.data);
};

export const loadBalancesByAddress = async (address: `0x${string}`) => {
  let _balances = [];

  const filteredNetworks = NETWORKS.map((slug) => networkBySlug[slug]);
  const requests = [];

  for (const network of filteredNetworks) {
    const chain = deFiIdByChainId[network.id];
    if (chain) {
      requests.push(getBalancesFromDeFI(address, network));
    } else {
      const tokens = tokensByNetworkSlug[network.slug] ?? [];

      const contracts: any = tokens.map((token: any) => ({
        address: token.nativeAddress,
        coinGeckoId: token.coinGeckoId,
        abi: erc20Abi,
      }));

      const promise = updateBalances(network, contracts, address);

      requests.push(promise);
    }
  }
  await Promise.all(requests).then((data) => {
    const flatData = data.flat(1);

    _balances = flatData;
    return flatData;
  });

  return _balances;
};

export const getStrategies = () => {
  return axios
    .get(`${process.env.ASTROLAB_API}/strategies`)
    .then((res) => res.data.data)
    .then((strategies) => {
      return strategies
        .filter((strategy) => {
          const { nativeNetwork, denomination } = strategy;
          const network = networkBySlug[nativeNetwork];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, symbol] = denomination.split(":");
          const token = tokenBySlug[`${network?.slug}:${symbol}`];

          return !!network && !!token ? true : false;
        })
        .map((strategy) => {
          const { id, name, nativeNetwork, nativeAddress, denomination, slug } =
            strategy;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, symbol] = denomination.split(":");
          const network = networkBySlug[nativeNetwork];

          const token = tokenBySlug[`${network.slug}:${symbol}`];

          return {
            id,
            name,
            address: nativeAddress,
            network: network,
            token,
            slug,
          } as Strategy;
        });
    });
};
