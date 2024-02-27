import { Balance } from "~/utils/interfaces";
import { abi as AgentAbi } from "@astrolabs/registry/abis/StrategyV5.json";

import getBalances from "~/utils/multicall";

import { select, selectGroup } from "~/store/strategies";
import {
  selectedStrategySelector,
  strategiesSelector,
} from "~/store/selectors/strategies";
import { Network } from "~/model/network";
import { getStoreState, store } from "~/store";
import { StrategyInterface } from "~/model/strategy";

export const getStrategiesBalances = async (
  address: `0x${string}`,
  strategies: StrategyInterface[]
) => {
  const balances: Balance[] = [];
  const strategiesByChainId: { [chainId: number]: StrategyInterface[] } = {};

  strategies.forEach((strategy) => {
    if (!strategiesByChainId[strategy.network.id])
      strategiesByChainId[strategy.network.id] = [];
    strategiesByChainId[strategy.network.id].push(strategy);
  });

  try {
    for (const key of Object.keys(strategiesByChainId)) {
      const strategies = strategiesByChainId[key];

      const calls = strategies.map((strategy) => ({
        address: strategy.address,
        abi: AgentAbi,
        token: strategy,
      }));

      const network = Network.byChainId[key];

      const result = await getBalances(network, calls, address);

      balances.push(...result);
    }

    return balances;
  } catch (e) {
    console.error(e);
  }
};

export const getStrategiesStore = () => {
  return getStoreState().strategies;
};

export const getStrategies = () => {
  const state = getStoreState();
  return strategiesSelector(state);
};
export const getSelectedStrategy = () => {
  const state = store.getState();
  return selectedStrategySelector(state);
};

export const selectStrategy = (strategy: StrategyInterface) =>
  store.dispatch(select(strategy));

export const selectStrategyGroup = (strategies: StrategyInterface[]) =>
  store.dispatch(selectGroup(strategies));
