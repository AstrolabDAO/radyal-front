import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import content from "../data/content.json";
import { chainImages } from "./mappings";
import { FEATURED_WALLETS } from "./web3-constants";

const WAGMI_PROJECT_ID = "2f0ff1893bae6d2f220397f005075a1f";

export const setupWeb3modal = (chains) => {
  const wagmiConfig = defaultWagmiConfig({
    projectId: WAGMI_PROJECT_ID,
    chains,
    metadata: {
      name: content.web3modal.name,
      description: content.web3modal.description,
      url: content.web3modal.url,
    },
  });

  const web3Modal = createWeb3Modal({
    wagmiConfig,
    chains,
    chainImages,
    projectId: WAGMI_PROJECT_ID,
    featuredWalletIds: Object.values(FEATURED_WALLETS),
    themeMode: "dark",
  });
  return { web3Modal, config: wagmiConfig };
};
