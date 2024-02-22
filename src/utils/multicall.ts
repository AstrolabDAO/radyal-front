import { getWagmiConfig } from "~/services/web3";
import { Balance, Token } from "./interfaces";
import { multicall as wagmiMulticall } from "@wagmi/core";
import { MulticallContracts, Narrow } from "viem";
import { Network } from "~/model/network";
export const multicall = (chainId: number, calls: any) => {
  return wagmiMulticall(getWagmiConfig(), {
    contracts: calls,
    chainId,
  });
};

export const getBalances = async (
  network: Network,
  contracts: { abi: any; address: `0x${string}`; token: Token }[] = [],
  address: `0x${string}`
) => {
  const result = await wagmiMulticall(getWagmiConfig(), {
    chainId: network.id,
    contracts: contracts
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ token, ...contract }) => [
        {
          ...contract,
          functionName: "balanceOf",
          args: [address],
        },
      ])
      .flat(1),
  });

  const filteredResults: any = result.map((res) => res.result);

  const balances = [];

  for (let i = 0; i < filteredResults.length; i++) {
    const balanceResult = filteredResults[i] as bigint;

    if (balanceResult === 0n) continue;

    const result = balanceResult as bigint;

    const contract = contracts[i];

    const _token = contract.token;
    const balance: Balance = {
      token: _token?.slug
        ? _token.slug
        : `${network.slug}:${_token.symbol.toLowerCase()}`,
      amountWei: result?.toString() ?? "0",
      amount: Number(result) / _token.weiPerUnit,
    };
    balances.push(balance);
  }

  return balances;
};
export default getBalances;
