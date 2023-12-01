import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Strategy } from "~/utils/interfaces";
import { TokensContext } from "./tokens-context";
import { getStrategies } from "~/utils/api";
import { ONE_MINUTE } from "~/main";

interface StrategyContextType {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  filteredStrategies: Strategy[];
  selectStrategy: (strategy: Strategy) => void;
  search: (searchString: string) => void;
  filterByNetworks: (networks: string[]) => void;
}

export const StrategyContext = createContext<StrategyContextType>({
  strategies: [],
  selectedStrategy: null,
  filteredStrategies: [],
  selectStrategy: () => {},
  search: () => {},
  filterByNetworks: () => {},
});

export const StrategyProvider = ({ children }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(null);

  const [search, setSearch] = useState<string>("");
  const [networksFilter, setNetworksFilter] = useState<string[]>([]);
  const { tokensIsLoaded, tokensBySlug } = useContext(TokensContext);

  const Provider = StrategyContext.Provider;
  const selectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const { data: strategiesData } = useQuery("strategies", getStrategies, {
    enabled: tokensIsLoaded && Object.values(tokensBySlug).length > 0,
    staleTime: ONE_MINUTE * 5,
  });

  const strategies = useMemo<Strategy[]>(() => {
    if (!strategiesData) return [];
    return strategiesData as Strategy[];
  }, [strategiesData]);

  const filteredStrategies = useMemo<Strategy[]>(() => {
    return strategies
      .filter(({ network }) => {
        if (!networksFilter.length) return true;
        return networksFilter.includes(network.slug);
      })
      .filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search, strategies, networksFilter]);

  return (
    <Provider
      value={{
        selectedStrategy,
        strategies,
        filteredStrategies,
        selectStrategy,
        search: (value) => setSearch(value),
        filterByNetworks: (value) => setNetworksFilter(value),
      }}
    >
      {children}
    </Provider>
  );
};
