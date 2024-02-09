import { Balance, Strategy } from "~/utils/interfaces";
import { abi as AgentAbi } from "@astrolabs/registry/abis/StrategyV5.json";
import { networkByChainId } from "~/utils/mappings";
import getBalances from "~/utils/multicall";

export const getStrategiesBalances = async (
  address: `0x${string}`,
  strategies: Strategy[]
) => {
  const balances: Balance[] = [];
  const strategiesByChainId: { [chainId: number]: Strategy[] } = {};

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

      const network = networkByChainId[key];

      const result = await getBalances(network, calls, address);
      balances.push(...result);
    }

    return balances;
  } catch (e) {
    console.error(e);
  }
};
