import { createContext, useMemo } from "react";
import { useGrouppedStrategies } from "~/hooks/strategies";
import { useBalances } from "~/hooks/tokens";
import { Strategy } from "~/model/strategy";

const StrategyTableContext = createContext({
  filteredStrategiesGroups: [],
  isFolio: false,
  holdings: [],
  totalHoldings: 0,
  weightedAPYs: [],
  weightedAPY: 0,
});

const StrategyTableContextProvider = ({ children, folio = false }) => {
  const balances = useBalances();

  const strategySlugs = Object.keys(Strategy.bySlug);
  const balanceSlugs = balances
    .filter((b) => strategySlugs.includes(b.token))
    .map((b) => b.token);

  const strategiesGroups = useGrouppedStrategies();

  const filteredStrategiesGroups = folio
    ? strategiesGroups.filter((strategies) =>
        strategies.find((s) => balanceSlugs.includes(s.slug))
      )
    : strategiesGroups;

  const [holdings, totalHoldings] = useMemo(() => {
    let total = 0;
    const sums = filteredStrategiesGroups.map((group) => {
      const sum = group.reduce(
        (acc, strategy) =>
          acc +
          ((folio
            ? Strategy.balanceBySlug[strategy.slug]?.amountUsd
            : strategy.tvlUsd) ?? 0),
        0
      );
      total += sum;
      return sum;
    });
    return [sums, total];
  }, [filteredStrategiesGroups]);

  const weightedAPYs = useMemo(
    () =>
      filteredStrategiesGroups.map((group, index) => {
        const groupHoldings = holdings[index];
        if (groupHoldings === 0) return 0; // Avoid division by zero

        return (
          group.reduce((acc, strategy) => {
            return (
              acc +
              ((folio
                ? Strategy.balanceBySlug[strategy.slug]?.amountUsd
                : strategy.tvlUsd) ?? 0) *
                strategy.apy
            );
          }, 0) / groupHoldings
        );
      }),
    [filteredStrategiesGroups, holdings]
  );

  // Calculate the average weighted APY based on total holdings
  const weightedAPY = useMemo(() => {
    if (totalHoldings === 0) return 0; // Avoid division by zero

    return (
      weightedAPYs.reduce((acc, apy, index) => acc + apy * holdings[index], 0) /
      totalHoldings
    );
  }, [weightedAPYs, holdings, totalHoldings]);

  return (
    <StrategyTableContext.Provider
      value={{
        filteredStrategiesGroups,
        isFolio: folio,
        holdings,
        totalHoldings,
        weightedAPYs,
        weightedAPY,
      }}
    >
      {children}
    </StrategyTableContext.Provider>
  );
};

export { StrategyTableContext, StrategyTableContextProvider };
