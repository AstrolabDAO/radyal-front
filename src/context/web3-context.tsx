import { createContext, useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";

import { useQuery } from "react-query";
import { WagmiConfig } from "wagmi";
import { getNetworks } from "~/utils/api.ts";
import {
  chainIdByDeFiId,
  chainImages,
  deFiIdByChainId,
  networkByChainId,
  networkBySlug,
} from "~/utils/mappings";
import { NETWORKS } from "~/utils/web3-constants";
import { clearNetworkTypeFromSlug } from "~/utils/format";
import { networkToWagmiChain } from "~/utils/converters";
import { setupWeb3modal } from "~/utils/setup-web3modal";
import deFiNetworks from "../data/defi-networks.json";

interface Web3ContextType {
  config: any;
}

const Web3Context = createContext<Web3ContextType>({
  config: null,
});

const Web3Provider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const { data: networks, isLoading } = useQuery("networks", getNetworks);

  useEffect(() => {
    if (isLoading || !networks) return;
    networks
      .filter((network) => NETWORKS.includes(network.slug))
      .map((network) => {
        networkBySlug[network.slug] = network;
        networkByChainId[network.id] = network;
        const deFiNetwork = deFiNetworks.find(
          (n) => n.metadata.absoluteChainId === network.id
        );
        if (deFiNetwork) {
          deFiIdByChainId[network.id] = deFiNetwork.id;
          chainIdByDeFiId[deFiNetwork.id] = network.id;
        }
      });

    const convertedNetworks = NETWORKS.map((n) => {
      const network = networkBySlug[n];
      const icon = `/networks/${clearNetworkTypeFromSlug(network.slug)}.svg`;
      chainImages[network.id] = icon;
      network.icon = `/networks/${clearNetworkTypeFromSlug(network.slug)}.svg`;

      return network ? networkToWagmiChain(network) : null;
    });

    const { config } = setupWeb3modal(convertedNetworks);
    setConfig(config);
  }, [networks, isLoading]);
  if (!config) return null;

  return (
    <Web3Context.Provider value={{ config }}>
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </Web3Context.Provider>
  );
};

export { Web3Context, Web3Provider };
