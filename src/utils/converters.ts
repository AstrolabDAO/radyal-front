import * as wagmiChains from "wagmi/chains";
import { Chain } from "wagmi/chains";
import { ChainRpcUrls, Network } from "./interfaces";
const wagmiChainById: { [id: number]: Chain } = {};
Object.values(wagmiChains).map((chain) => (wagmiChainById[chain.id] = chain));

export const networkToWagmiChain = (network: Network) => {
  if (!network) return;

  const wagmiNetwork = wagmiChainById[network.id];

  if (wagmiNetwork) return wagmiNetwork;

  wagmiNetwork.rpcUrls.default = {
    http: network.httpRpcs,
  } as ChainRpcUrls;
};
