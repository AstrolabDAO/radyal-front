import { createContext, useEffect, useMemo, useState } from "react";

import "react-toastify/dist/ReactToastify.css";

import { useQuery } from "react-query";
import { WagmiConfig, useNetwork, useWalletClient } from "wagmi";
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
import { Network } from "~/utils/interfaces";

interface Web3ContextType {
  config: any;
  networks: Network[];
}

const Web3Context = createContext<Web3ContextType>({
  config: null,
  networks: [],
});

export let currentChain = null;
export let etherSigner = null;

const Web3Provider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const { data: networksData, isLoading } = useQuery("networks", getNetworks);

  const networks = useMemo(() => {
    return networksData?.filter((network) => NETWORKS.includes(network.slug));
  }, [networksData]);

  useEffect(() => {
    if (isLoading || !networks) return;
    networks.map((network) => {
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
    <Web3Context.Provider value={{ config, networks }}>
      <WagmiConfig config={config}>
        <UpdateSigner>{children}</UpdateSigner>
      </WagmiConfig>
    </Web3Context.Provider>
  );
};

const UpdateSigner = ({ children }) => {
  const { data: signer } = useWalletClient();
  const { chain } = useNetwork();
  useEffect(() => {
    etherSigner = signer;
    currentChain = chain;
  }, [chain, signer]);
  return <>{children}</>;
};
export { Web3Context, Web3Provider };
