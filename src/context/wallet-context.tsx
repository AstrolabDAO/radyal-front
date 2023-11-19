import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { erc20Abi } from "abitype/abis";
import addresses from "../data/token-addresses.json";
import { updateTokenPrices } from "../utils/api";
import { DeFiBalance } from "../utils/interfaces";
import { networkBySlug } from "../utils/mappings";
import updateBalances from "../utils/multicall";
import { NETWORKS } from "../utils/web3-constants";
import { TokensContext } from "./tokens-context";
import { toast } from "react-toastify";

export const WalletContext = createContext({
  balances: [],
});

export const WalletProvider = ({ children }) => {
  const localBalances = localStorage.getItem("balances");
  const localBalancesDate = Number(localStorage.getItem("balancesExpiry"));

  const now = new Date().getTime();

  const Provider = WalletContext.Provider;

  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState(
    localBalances ? JSON.parse(localBalances) : []
  );

  const { refreshTokenBySlugs, updatePrices } = useContext(TokensContext);
  const filteredNetworks = NETWORKS.map((slug) => networkBySlug[slug]);

  useEffect(() => {
    if (!isConnected) return;

    const loadBalancesByAddress = async (address: `0x${string}`) => {
      let _balances = [];
      const requests = [];
      const needBalances = [];
      for (const network of filteredNetworks) {
        const tokenKeys = Object.keys(addresses[network.id].tokens);
        const tokens = Object.values(addresses[network.id].tokens)
          .filter((token, index) => tokenKeys[index] !== "WGAS")
          .slice(0, 10);
        const contracts: any = tokens.map((token: any) => ({
          address: token.address,
          coingeckoId: token.coingeckoId,
          abi: erc20Abi,
        }));
        needBalances.push({ network, tokens });
        const promise = updateBalances(network, contracts, address);
        toast.promise(promise, {
          pending: `Get balances from ${network.name}`,
          success: `Balances from ${network.name} loaded`,
          error: "Balances not found 🤯",
        });
        requests.push(promise);
        //}

        await Promise.all(requests).then((data) => {
          const flatData = data.flat(1);
          setBalances(flatData);
          refreshTokenBySlugs();
          localStorage.setItem("balances", JSON.stringify(flatData));
          localStorage.setItem(
            "balancesExpiry",
            now + (60 * 1000 * 10).toString()
          );
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

  return <Provider value={{ balances }}>{children}</Provider>;
};
