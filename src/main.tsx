import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NETWORKS } from "./utils/web3-constants.ts";
import { networkToWagmiChain } from "./utils/converters.ts";
import { setupWeb3modal } from "./utils/setup-web3modal.ts";
import { Network } from "./utils/interfaces.ts";
import networksData from "./data/networks.json";
import { WagmiConfig } from "wagmi";
export const networkBySlug: { [slug: string]: Network } = {};
networksData.map((network) => {
  networkBySlug[network.slug] = network;
});

const convertedNetworks = NETWORKS.map((n) => {
  const network = networkBySlug[n];
  return network ? networkToWagmiChain(network) : null;
});

convertedNetworks.map((n) => {
  console.log(n.rpcUrls.public.http);
});
export const { web3Modal, config } = setupWeb3modal(convertedNetworks);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
