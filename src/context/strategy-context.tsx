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
  const { tokensIsLoaded } = useContext(TokensContext);

  // const data = useAllowance("0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE", "0x7B56288776Cae4260770981b6BcC0f6D011C7b72");

  const Provider = StrategyContext.Provider;
  const selectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const { data: strategiesData } = useQuery("strategies", getStrategies, {
    enabled: tokensIsLoaded,
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
