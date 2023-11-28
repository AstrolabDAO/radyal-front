import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

import { erc20Abi } from "abitype/abis";
import addresses from "../data/token-addresses.json";
import { getBalancesFromDeFI, updateTokenPrices } from "../utils/api";
import {
  Balance,
  BalanceBySlugMapping,
  DeFiBalance,
} from "../utils/interfaces";
import {
  balanceBySlug as balanceBySlugMapping,
  updateBalanceMapping,
} from "../utils/mappings";
import { deFiIdByChainId, networkBySlug } from "../utils/mappings";
import updateBalances from "../utils/multicall";
import { NETWORKS } from "../utils/web3-constants";
import { TokensContext } from "./tokens-context";
import { toast } from "react-toastify";

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

  const { refreshTokenBySlugs, updatePrices, tokensIsLoaded } =
    useContext(TokensContext);

  const localBalances = localStorage.getItem(`balances-${address}`);
  const localBalancesDate = Number(localStorage.getItem("balancesExpiry"));

  const now = new Date().getTime();
  const Provider = WalletContext.Provider;

  const [balances, setBalances] = useState<Balance[]>(
    localBalances ? JSON.parse(localBalances) : []
  );

  const [balancesBySlug, setBalancesBySlug] = useState<BalanceBySlugMapping>(
    {}
  );

  const sortedBalances = useMemo(() => {
    return balances.sort((a, b) =>
      BigInt(a.amount) > BigInt(b.amount) ? -1 : 1
    );
  }, [balances]);

  const filteredNetworks = NETWORKS.map((slug) => networkBySlug[slug]);

  useEffect(() => {
    balances.forEach((balance) => updateBalanceMapping(balance));
  }, [balances]);

  useEffect(() => {
    if (!isConnected || !tokensIsLoaded) return;

    const loadBalancesByAddress = async (address: `0x${string}`) => {
      let _balances = [];
      const requests = [];
      for (const network of filteredNetworks) {
        const chain = deFiIdByChainId[network.id];
        if (chain) {
          requests.push(getBalancesFromDeFI(address, network));
        } else {
          const tokenKeys = Object.keys(addresses[network.id].tokens);
          const tokens = Object.values(addresses[network.id].tokens)
            .filter((token, index) => tokenKeys[index] !== "WGAS")
            .slice(0, 10);
          const contracts: any = tokens.map((token: any) => ({
            address: token.address,
            coinGeckoId: token.coinGeckoId,
            abi: erc20Abi,
          }));
          const promise = updateBalances(network, contracts, address);
          toast.promise(promise, {
            pending: `Get balances from ${network.name}`,
            success: `Balances from ${network.name} loaded`,
            error: "Balances not found 🤯",
          });
          requests.push(promise);
        }

        await Promise.all(requests).then((data) => {
          const flatData = data.flat(1);

          setBalances(flatData);
          setBalancesBySlug(balanceBySlugMapping);
          refreshTokenBySlugs();

          localStorage.setItem(`balances-${address}`, JSON.stringify(flatData));
          localStorage.setItem("balancesExpiry", now + (60 * 1000).toString());
          _balances = flatData;
          return flatData;
        });
      }
      return _balances;
    };

    const _balances: DeFiBalance[] =
      localBalances === null || now > localBalancesDate + 60 * 1000 * 10 // 10 minutes
        ? []
        : JSON.parse(localBalances);

    if (!_balances.length) {
      loadBalancesByAddress(address)
        .then(async (_balances) => updateTokenPrices(_balances))
        .then((prices) => {
          updatePrices(prices);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnected]);

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
