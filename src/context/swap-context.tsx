import { createContext, useEffect } from "react";
import { useNetwork, useWalletClient } from "wagmi";

export let currentChain = null;
export let etherSigner = null;

export const SwapContext = createContext({ chain: null, signer: null });

export const SwapProvider = ({ children }) => {
  const Provider = SwapContext.Provider;
  const { data: signer } = useWalletClient();
  const { chain } = useNetwork();
  useEffect(() => {
    etherSigner = signer;
    currentChain = chain;
  }, [chain, signer]);

  return <Provider value={{ chain, signer }}>{children}</Provider>;
};
