import { useStrategiesNetworks } from "~/hooks/strategies";
import { Input } from "./styled";
import { filterByNetworks, search } from "~/store/strategies";
import { dispatch } from "~/store";
import NetworkSelect, { NetworkSelectData } from "./NetworkSelect";
import { useContext, useMemo } from "react";
import { StrategyTableContext } from "~/context/strategy-table.context";
import { Strategy } from "~/model/strategy";
import { Network } from "~/model/network";

export const FolioActionBar = () => {
  const { filteredStrategiesGroups } = useContext(StrategyTableContext);
  const strategiesNetworks = useMemo(() => {
    if (filteredStrategiesGroups.length === 0) return [];
    const flat: Strategy[] = filteredStrategiesGroups.reduce((acc, current) =>
      acc.concat(current)
    );
    const networkSlugs = new Set<string>();
    flat.forEach((strategy) => {
      if (Strategy.balanceBySlug[strategy.slug]) {
        networkSlugs.add(strategy.network.slug);
      }
    });

    return Array.from(networkSlugs).map((slug) => Network.bySlug[slug]);
  }, [filteredStrategiesGroups]);
  return (
    <div className="flex flex-col md:flex-row w-full relative z-30 mb-4">
      <div className="mr-4 w-full flex flex-col">
        <span className="label-text block mb-1">Search a strategy</span>
        <Input
          type="text"
          className="bordered-hover"
          placeholder="“Stable”, “Arbitrum”, “Staking”..."
          onChange={({ target }) => {
            dispatch(search(target.value));
          }}
        />
      </div>
      <div className="flex flex-col relative ">
        <span className="label-text mb-1">Chain</span>
        <NetworkSelect
          isSearchable={false}
          className="w-64 h-12"
          networks={strategiesNetworks}
          onChange={(value: Array<NetworkSelectData>) => {
            dispatch(filterByNetworks(value.map((v) => v.network?.slug)));
          }}
        />
      </div>
    </div>
  );
};
