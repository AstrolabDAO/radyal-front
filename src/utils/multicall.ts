import { MulticallContracts, Narrow } from "viem";
import { multicall as wagmiMulticalll } from "wagmi/actions";
import { Balance, Network } from "./interfaces";
import { tokenBySlug, updateBalanceMapping } from "./mappings";

export const multicall = (
  chainId: number,
  calls: Narrow<readonly [...MulticallContracts<any>]>
) => {
  return wagmiMulticalll({
    chainId,
    contracts: calls,
  });
};

export const getBalances = async (
  network: Network,
  contracts: any,
  address: string
) => {
  const result = await wagmiMulticalll({
    chainId: network.id,
    contracts: contracts
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ slug, ...contract }) => [
        {
          ...contract,
          functionName: "balanceOf",
          args: [address],
        },
      ])
      .flat(1),
  });

  const filteredResults = result.map((res) => res.result);
  const balances = [];

  for (let i = 0; i < filteredResults.length; i++) {
    const balanceResult = filteredResults[i] as bigint;

    if (balanceResult === 0n) continue;

    const result = balanceResult as bigint;

    const contract = contracts[i];
    const _token = tokenBySlug[contract.slug];
    const balance: Balance = {
      slug: _token?.slug
        ? _token.slug
        : `${network.slug}:${contract.symbol.toLowerCase()}`,
      amount: result?.toString() ?? "0",
    };
    balances.push([balance, _token]);
    updateBalanceMapping(balance);
  }

  return balances;
};
export default getBalances;
