import { multicall as wagmiMulticalll } from "wagmi/actions";
import { Network, Token } from "./interfaces";
import { MulticallContracts, Narrow } from "viem";
import { tokenBySlug } from "./mappings";
import { getTokensPrices } from "./api";

export const multicall = (
  chainId: number,
  calls: Narrow<readonly [...MulticallContracts<any>]>
) => {
  return wagmiMulticalll({
    chainId,
    contracts: calls,
  });
};

export const updateBalances = (
  network: Network,
  contracts: any,
  address: string
) => {
  return wagmiMulticalll({
    chainId: network.id,
    contracts: contracts
      .map((contract) => [
        {
          ...contract,
          functionName: "balanceOf",
          args: [address],
        },
        {
          ...contract,
          functionName: "decimals",
        },
        {
          ...contract,
          functionName: "symbol",
        },
      ])
      .flat(1),
  }).then(async (result) => {
    const filteredResults = result.map((res) => res.result);
    const tokens = [];

    for (let i = 0; i < filteredResults.length; i += 3) {
      const [balance, decimals, symbol] = filteredResults.slice(i, i + 3) as [
        bigint,
        number,
        string
      ];

      if (balance === 0n) continue;

      const result = balance as bigint;
      const contract = contracts[i];

      const token: Token = {
        address: contract.address,
        amount: result.toString(),
        decimals,
        symbol,
        network,
        coingeckoId: contract.coingeckoId,
        slug: `${network.id}:${contract.address}`,
      };

      tokens.push(token);
      tokenBySlug[token.slug] = token;
    }

    return tokens;
  });
};
export default updateBalances;
