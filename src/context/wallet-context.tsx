import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

import { useQuery } from "react-query";
import { ONE_MINUTE } from "~/main";
import { loadBalancesByAddress } from "../utils/api";
import { BalanceBySlugMapping } from "../utils/interfaces";
import {
  balanceBySlug as balanceBySlugMapping,
  updateBalanceMapping,
} from "../utils/mappings";
import { TokensContext } from "./tokens-context";

export const WalletContext = createContext({
  balances: [],
  sortedBalances: [],
  balancesBySlug: {},
});

export let currentChain = null;
export let etherSigner = null;

export const WalletProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useWalletClient();
  const { chain } = useNetwork();

  const { refreshTokenBySlugs, tokensIsLoaded } = useContext(TokensContext);

  const Provider = WalletContext.Provider;

  const [balancesBySlug, setBalancesBySlug] = useState<BalanceBySlugMapping>(
    {}
  );

  const { data: balances } = useQuery(
    "balances",
    () => loadBalancesByAddress(address),
    {
      enabled: !!address && tokensIsLoaded && isConnected,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
      initialData: [],
    }
  );

  useEffect(() => {
    setBalancesBySlug(balanceBySlugMapping);
    refreshTokenBySlugs();
  }, [balances, refreshTokenBySlugs]);
  const sortedBalances = useMemo(() => {
    return balances.sort((a, b) =>
      BigInt(a.amount) > BigInt(b.amount) ? -1 : 1
    );
  }, [balances]);

  useEffect(() => {
    balances.forEach((balance) => updateBalanceMapping(balance));
  }, [balances]);

  useEffect(() => {
    etherSigner = signer;
    currentChain = chain;
  }, [chain, signer]);

  return (
    <Provider value={{ balances, balancesBySlug, sortedBalances }}>
      {children}
    </Provider>
  );
};
