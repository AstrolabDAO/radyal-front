import { createContext, useContext, useEffect, useState } from "react";
import { Strategy, Token } from "~/utils/interfaces";
import importedStrategies from "~/data/strategies.json";
import { networkBySlug, tokenBySlug } from "~/utils/mappings";
import tokenAddresses from "~/data/token-addresses.json";
import { TokensContext } from "./tokens-context";

interface StrategyContextType {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  selectStrategy: (strategy: Strategy) => void;
  updateStrategies: (strategies: Strategy[]) => void;
}

export const StrategyContext = createContext<StrategyContextType>({
  strategies: [],
  selectedStrategy: null,
  selectStrategy: () => {},
  updateStrategies: () => {},
});

export const StrategyProvider = ({ children }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(null);

  const [strategies, setStrategies] = useState<Strategy[]>([]);

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
  }, []);
  return (
    <Provider
      value={{ selectedStrategy, strategies, selectStrategy, updateStrategies }}
    >
      {children}
    </Provider>
  );
};
