import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import App from "./App.tsx";
import deFiNetworks from "./data/defi-networks.json";
import networksData from "./data/networks.json";
import "./index.css";
import { networkToWagmiChain } from "./utils/converters.ts";
import { clearNetworkTypeFromSlug } from "./utils/format.ts";
import {
  chainIdByDeFiId,
  chainImages,
  deFiIdByChainId,
  networkBySlug,
} from "./utils/mappings.ts";
import { setupWeb3modal } from "./utils/setup-web3modal.ts";
import { NETWORKS } from "./utils/web3-constants.ts";

networksData.map((network) => {
  networkBySlug[network.slug] = network;
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

export const { web3Modal, config } = setupWeb3modal(convertedNetworks);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
