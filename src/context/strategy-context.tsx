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
  updateBalanceMapping,
  updateStrategyMapping,
} from "~/utils/mappings";
import getBalances from "~/utils/multicall";
import { TokensContext } from "./tokens-context";
interface StrategyContextType {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  filteredStrategies: { [slug: string]: Strategy[] };
  balances: Balance[];
  selectStrategy: (strategy: Strategy) => void;
  search: (searchString: string) => void;
  filterByNetworks: (networks: string[]) => void;
}

export const StrategyContext = createContext<StrategyContextType>({
  strategies: [],
  selectedStrategy: null,
  filteredStrategies: {},
  balances: [],
  selectStrategy: () => {},
  search: () => {},
  filterByNetworks: () => {},
});

export const StrategyProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(null);

  const [search, setSearch] = useState<string>("");
  const [networksFilter, setNetworksFilter] = useState<string[]>([]);
  const { tokensIsLoaded } = useContext(TokensContext);

  // const data = useAllowance("0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE", "0x7B56288776Cae4260770981b6BcC0f6D011C7b72");

  const Provider = StrategyContext.Provider;
  const selectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const { data: strategiesData, isLoading: strategiesIsLoading } = useQuery<
    Strategy[]
  >("strategies", getStrategies, {
    enabled: tokensIsLoaded,
    staleTime: ONE_MINUTE * 5,
  });

  const strategies = useMemo<Strategy[]>(() => {
    if (!strategiesData) return [];
    return strategiesData.map((strategy) => {
      updateStrategyMapping(strategy);
      return strategy;
    }) as Strategy[];
  }, [strategiesData]);

  const { data: strategiesBalancesData } = useQuery<Balance[]>(
    "strategiesBalances",
    async () => {
      const balances = [];

      try {
        for (const key of Object.keys(strategiesByChainId)) {
          const strategies = strategiesByChainId[key];

          const calls = strategies.map((strategy) => ({
            address: strategy.address,
            abi: AgentAbi,
            symbol: strategy.share.symbol,
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
      .filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
      .map((strategy) => {
        const splittedSlug = strategy.slug.split(":")[2];
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
        balances,
        search: (value) => setSearch(value),
        filterByNetworks: (value) => setNetworksFilter(value),
      }}
    >
      {children}
    </Provider>
  );
};
