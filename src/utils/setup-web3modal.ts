import { Web3ModalOptions, createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi";
import { iconByNetwork } from "./mappings";
import { http, createConfig } from '@wagmi/core'
import { FEATURED_WALLETS } from "~/constants";
import { Config } from "wagmi";

const WAGMI_PROJECT_ID = "2f0ff1893bae6d2f220397f005075a1f";
export let WAGMI_CONFIG = {} as Config;

const w3mConfig = (): Web3ModalOptions<any> => ({
  wagmiConfig: WAGMI_CONFIG,
  // iconByNetwork,
  projectId: WAGMI_PROJECT_ID,
  featuredWalletIds: Object.values(FEATURED_WALLETS),
  themeMode: "dark",
  // TODO: use css variables only
  themeVariables: {
    "--w3m-border-radius-master": "2px",
    "--w3m-font-family": "Inter",
    "--w3m-font-size-master": ".7rem",
    "--w3m-accent": "var(--primary)",
    "--w3m-color-mix"	: "#C1C1C1",
  }
});

export const setupWeb3modal = (chains) => {
  const transports = {};
  chains.forEach((chain) => {
    transports[chain.id] = http();
  });
  WAGMI_CONFIG = defaultWagmiConfig({
    projectId: WAGMI_PROJECT_ID,
    chains,
    metadata: {
      name: "Astrolab Radyal",
      description: "",
      url: "https://radyal.xyz",
      icons: [],
    },
    transports
  });
  const web3Modal = createWeb3Modal(w3mConfig());
  return { web3Modal, config: WAGMI_CONFIG };
};
