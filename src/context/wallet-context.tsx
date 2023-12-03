import { createContext, useContext, useEffect, useMemo } from "react";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

import { useQuery } from "react-query";
import { ONE_MINUTE } from "~/main";
import { loadBalancesByAddress } from "../utils/api";
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

  const { refreshTokenBySlugs, tokensIsLoaded, addToken } =
    useContext(TokensContext);

  const Provider = WalletContext.Provider;

  const { data: balancesData } = useQuery(
    "balances",
    () => loadBalancesByAddress(address),
    {
      enabled: !!address && tokensIsLoaded && isConnected,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

  const balances = useMemo(() => {
    if (!balancesData) return [];
    const _balances = balancesData.map(([balance, token]) => {
      if (token) {
        addToken(token);
      }
      return balance;
    });
    loadPrices();
    return _balances;
  }, [balancesData, addToken, loadPrices]);

  useEffect(() => {
    setBalancesBySlug(balanceBySlugMapping);
    refreshTokenBySlugs();
  }, [balances, refreshTokenBySlugs]);

  useEffect(() => {
    balances.forEach((balance) => updateBalanceMapping(balance));
  }, [balances]);

  useEffect(() => {
    etherSigner = signer;
    currentChain = chain;
  }, [chain, signer]);

  return (
    <Provider
      value={{
        balances: balances ?? [],
        balancesBySlug,
        sortedBalances,
      }}
    >
      {children}
    </Provider>
  );
};
