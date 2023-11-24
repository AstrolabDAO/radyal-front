import { createContext, useContext, useEffect, useState } from "react";
import { Strategy, Token } from "~/utils/interfaces";
import importedStrategies from "~/data/strategies.json";
import { networkBySlug, tokenBySlug } from "~/utils/mappings";
import tokenAddresses from "~/data/token-addresses.json";
import { TokensContext } from "./tokens-context";

interface StrategyContextType {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  filteredStrategies: Strategy[];
  selectStrategy: (strategy: Strategy) => void;
  updateStrategies: (strategies: Strategy[]) => void;
  search: (searchString: string) => void;
}

export const StrategyContext = createContext<StrategyContextType>({
  strategies: [],
  selectedStrategy: null,
  filteredStrategies: [],
  selectStrategy: () => {},
  updateStrategies: () => {},
  search: () => {},
});

export const StrategyProvider = ({ children }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(null);

  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);

  const Provider = StrategyContext.Provider;
  const selectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };
  const updateStrategies = (strategies: Strategy[]) => {
    setStrategies(strategies);
  };

  const { updateTokenBySlug } = useContext(TokensContext);

  useEffect(() => {
    const populatedStrategies = importedStrategies
      .filter((s) => {
        const { underlying } = s;
        const [networkSlug, symbol] = underlying.split(":");

        const network = networkBySlug[networkSlug];
        const tokenData =
          tokenAddresses[network.id]?.tokens?.[symbol.toUpperCase()];
        return tokenData ? true : false;
      })
      .map((s: any) => {
        const { underlying } = s;
        const [networkSlug, symbol] = underlying.split(":");
        const network = networkBySlug[networkSlug];

        if (!tokenBySlug[underlying]) {
          const tokenData =
            tokenAddresses[network.id].tokens[symbol.toUpperCase()];

          updateTokenBySlug(underlying, {
            address: tokenData.address,
            network: network,
            coingeckoId: tokenData.coingeckoId,
            symbol,
            icon: `/tokens/${symbol}.svg`,
            slug: underlying,
          } as Token);
        }
        const token = tokenBySlug[underlying];

        return {
          ...s,
          nativeNetwork: network,
          token,
        } as Strategy;
      });
    setStrategies(populatedStrategies);
    setFilteredStrategies(populatedStrategies);
  }, []);

  const search = (searchString: string) => {
    const filtered = strategies.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchString.toLowerCase())
      )
    );
    setFilteredStrategies(filtered);
  };

  return (
    <Provider
      value={{
        selectedStrategy,
        strategies,
        filteredStrategies,
        selectStrategy,
        updateStrategies,
        search,
      }}
    >
      {children}
    </Provider>
  );
};
