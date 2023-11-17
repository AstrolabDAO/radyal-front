import { defineChain } from "viem";
import { Network } from "./interfaces";
import { slugify } from "./format";

export const networkToWagmiChain = (network: Network) => {
  const { id, name, explorers, httpRpcs } = network;
  const symbol = "ETH"; //getChainSymbol()[1].toUpperCase() ?? "ETH";
  return defineChain({
    id: id,
    name: name,
    network: slugify(name),
    nativeCurrency: { name: `${name} ${symbol}`, symbol, decimals: 18 },
    blockExplorers: {
      default: {
        name: name,
        url: explorers[0],
      },
    },
    rpcUrls: {
      default: { http: [httpRpcs[0]] },
      public: { http: [httpRpcs[0]] },
    },
    contracts: {
      ensRegistry: {
        address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      },
      ensUniversalResolver: {
        address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",
        blockCreated: 16966585,
      },
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 14353601,
      },
    },
  });
};
