import { abi as AgentAbi } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { ONE_MINUTE } from "~/main";
import { getStrategies } from "~/utils/api";
import { Balance, GrouppedStrategies, Strategy } from "~/utils/interfaces";

import {
  networkByChainId,
  strategiesByChainId,
  tokensBySlugForPriceAPI,
  updateBalanceMapping,
  updateStrategyMapping,
} from "~/utils/mappings";

import getBalances from "~/utils/multicall";
import { TokensContext } from "./tokens-context";
import { zeroAddress } from "viem";
interface StrategyContextType {
  strategies: Strategy[];
  selectedGroup: Strategy[],
  selectedStrategy: Strategy;
  filteredStrategies: { [slug: string]: Strategy[] };
  balances: Balance[];
  selectStrategy: (strategy: Strategy) => void;
  search: (searchString: string) => void;
  selectGroup: (strategies: Strategy[]) => void;
  filterByNetworks: (networks: string[]) => void;
}

export const StrategyContext = createContext<StrategyContextType>({
  strategies: [],
  selectedGroup: [],
  selectedStrategy: null,
  filteredStrategies: {},
  balances: [],
  selectStrategy: () => {},
  selectGroup : () => {},
  search: () => {},
  filterByNetworks: () => {},
});

export const StrategyProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(null);
  const [selectedGroup, setSelectedGroup] = useState<Strategy[]>([]);

  const [search, setSearch] = useState<string>("");
  const [networksFilter, setNetworksFilter] = useState<string[]>([]);
  const { tokensIsLoaded } = useContext(TokensContext);

  const Provider = StrategyContext.Provider;
  const selectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const selectGroup = (strategies: Strategy[]) => {
    setSelectedGroup(strategies);
  }

  const { data: strategiesData, isLoading: strategiesIsLoading } = useQuery<
    Strategy[]
  >("strategies", getStrategies, {
    enabled: tokensIsLoaded,
    staleTime: ONE_MINUTE * 5,
  });

  const strategies = useMemo<Strategy[]>(() => {
    if (!strategiesData) return [];
    return strategiesData.map((strategy) => {
      const { asset } = strategy;
      tokensBySlugForPriceAPI[asset.slug] = asset;
      updateStrategyMapping(strategy);
      return strategy;
    }) as Strategy[];
  }, [strategiesData]);

  const { data: strategiesBalancesData } = useQuery<Balance[]>(
    `strategiesBalances-${address}`,
    async () => {
      const balances = [];

      try {
        for (const key of Object.keys(strategiesByChainId)) {
          const strategies = strategiesByChainId[key];

          const calls = strategies.map((strategy) => ({
            address: strategy.address,
            abi: AgentAbi,
            symbol: strategy.symbol,
            slug: strategy.slug,
          }));

          const network = networkByChainId[key];

          const result = await getBalances(network, calls, address);

          balances.push(result.map(([balance]) => balance));
          return balances.flat(1);
        }
      } catch (e) {
        console.error(e);
      }
    },
    {
      enabled: isConnected && !strategiesIsLoading && tokensIsLoaded,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

  const balances = useMemo(() => {
    if (!strategiesBalancesData) return [];

    strategiesBalancesData.forEach((balance: Balance) => {
      updateBalanceMapping(balance);
    });
    return strategiesBalancesData;
  }, [strategiesBalancesData]);

  const filteredStrategies = useMemo<GrouppedStrategies>(() => {
    const grouppedStrategies: GrouppedStrategies = {};

    strategies
      .filter(({ network }) => {
        if (!networksFilter.length) return true;
        return networksFilter.includes(network.slug);
      })
      .filter(({ address }) => address !== zeroAddress)
      .filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
      .map((strategy) => {
        const splittedSlug = strategy.slug.split(":")[1];

        if (!grouppedStrategies[splittedSlug])
          grouppedStrategies[splittedSlug] = [];
        grouppedStrategies[splittedSlug].push(strategy);
      });
    return grouppedStrategies;
  }, [search, strategies, networksFilter]);

  return (
    <Provider
      value={{
        selectedStrategy,
        strategies,
        filteredStrategies,
        selectStrategy,
        selectGroup,
        balances,
        selectedGroup,
        search: (value) => setSearch(value),
        filterByNetworks: (value) => setNetworksFilter(value),

      }}
    >
      {children}
    </Provider>
  );
};
