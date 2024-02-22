import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import content from "../data/content.json";
import { chainImages } from "./mappings";
import { FEATURED_WALLETS } from "./web3-constants";
//import logo from "~/assets/images/logo.svg";
const WAGMI_PROJECT_ID = "2f0ff1893bae6d2f220397f005075a1f";

interface Web3ModalConfig {
  web3Modal: ReturnType<typeof createWeb3Modal>;
  config: any;
}
export const setupWeb3modal = (chains): Web3ModalConfig => {
  const wagmiConfig = defaultWagmiConfig({
    projectId: WAGMI_PROJECT_ID,
    chains,
    metadata: {
      name: content.web3modal.name,
      description: content.web3modal.description,
      url: content.web3modal.url,
      icons: [],
    },
  });

  const web3Modal = createWeb3Modal({
    wagmiConfig,
    chainImages,
    projectId: WAGMI_PROJECT_ID,
    featuredWalletIds: Object.values(FEATURED_WALLETS),
    themeMode: "dark",
    themeVariables: {
      "--w3m-border-radius-master": "2px",
      "--w3m-font-family": "Inter",
      "--w3m-accent": "var(--primary)",
      "--w3m-color-mix": "#C1C1C1",
    },
  });

  return { web3Modal, config: wagmiConfig };
};
