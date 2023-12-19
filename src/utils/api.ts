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
import updateBalances, { multicall } from "./multicall";
import { NETWORKS } from "./web3-constants";
import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5Agent.json";

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
        .map((result: DeFiBalance) => {
          const { amount, token: apiToken } = result;
          const balance: Balance = {
            slug: `${network.slug}:${apiToken.symbol.toLowerCase()}`,
            amount,
          };

          const existingToken = tokenBySlug[balance.slug];

          if (!existingToken) {
            const _token = {
              address: apiToken.address,
              name: apiToken.name,
              decimals: apiToken.decimals,
              coinGeckoId: apiToken.coingeckoId,
              weiPerUnit: 10 ** apiToken.decimals,
              icon: apiToken.icon,
              network,
              symbol: apiToken.symbol,
              slug: `${network.slug}:${apiToken.symbol.toLowerCase()}`,
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
            weiPerUnit: 10 ** scale,
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

export const getStrategies = async () => {
  const strategiesData = await axios
    .get(`${process.env.ASTROLAB_API}/strategies`)
    .then((res) => res.data.data);

  const strategiesByNetwork = {};

  // Generate strategies mapping by Network with api Data
  for (let i = 0; i < strategiesData.length; i++) {
    const strategy = strategiesData[i];
    const { nativeNetwork } = strategy;
    const network = networkBySlug[nativeNetwork];
    if (!network) continue;
    if (!strategiesByNetwork[network.id]) strategiesByNetwork[network.id] = [];
    // Add index on strategy to retrieve it after
    strategy.index = i;
    strategiesByNetwork[network.id].push(strategy);
  }

  // Loop on Strategies by networks to multicall (getting strategy token details)
  for (const chainId of Object.keys(strategiesByNetwork)) {
    const networkStrategies = strategiesByNetwork[chainId];
    const contractsCalls = networkStrategies
      .map((strategy) => {
        const call = {
          abi: AgentABI,
          address: strategy.nativeAddress,
        };
        return [
          {
            ...call,
            functionName: "symbol",
          },
          {
            ...call,
            functionName: "decimals",
          },
        ];
      })
      .flat(1);

    const result = await multicall(Number(chainId), contractsCalls);

    // Add multicall result on api Data
    networkStrategies.forEach((strategy, index) => {
      const resultIndex = index === 0 ? index : index + 2;
      strategiesData[strategy.index].startToken = {
        symbol: result[resultIndex]?.result ?? null,
        decimals: result[resultIndex + 1]?.result ?? null,
      };
    });
  }

  const strategies = strategiesData
    .filter((strategy) => {
      const { nativeNetwork, denomination } = strategy;
      const network = networkBySlug[nativeNetwork];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, symbol] = denomination.split(":");
      const token = tokenBySlug[`${network?.slug}:${symbol}`];

      return !!network && !!token ? true : false;
    })
    .map((strategy) => {
      const {
        id,
        name,
        nativeNetwork,
        nativeAddress,
        denomination,
        slug,
        startToken,
      } = strategy;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, symbol] = denomination.split(":");
      const network = networkBySlug[nativeNetwork];

      const token = tokenBySlug[`${network.slug}:${symbol}`];

      return {
        id,
        name,
        address: nativeAddress,
        network: network,
        startToken,
        token,
        slug,
      } as Strategy;
    });

  return strategies;
};

export const getProtocols = async () => {
  const result = await axios.get(`${process.env.ASTROLAB_API}/protocols`);
  return result.data.data;
};
