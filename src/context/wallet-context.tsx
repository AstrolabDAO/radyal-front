import { createContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import networks from "../data/networks.json";
import { IDeFiBalance } from "../utils/interfaces";

import { deFiIdByChainId } from "../main";
import axios from "axios";
import { BALANCE_API } from "../utils/constants";
export const WalletContext = createContext({
  balances: [],
});

export const WalletProvider = ({ children }) => {
  const Provider = WalletContext.Provider;
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (!isConnected) return;
    const loadBalancesByAddress = async (address: `0x${string}`) => {
      const _balances = [];
      for (const network of networks) {
        const chain = deFiIdByChainId[network.id];
        if (!chain) console.log(network.id, network.name);
        if (!chain) continue;

        const balance = await axios
          .get(
            `${BALANCE_API}/balances?addresses[]=${address}&chains[]=${
              deFiIdByChainId[network.id]
            }`
          )
          .then((res) => res.data);

        _balances.push(balance);
        setBalances([..._balances]);
      }
    };

    const localBalances = localStorage.getItem("balances") ?? "[]";
    const localBalancesDate = Number(localStorage.getItem("balancesExpiry"));
    const now = new Date().getTime();

    const balances: IDeFiBalance[] =
      localBalances && now > localBalancesDate + 60 * 1000 * 10 // 10 minutes
        ? []
        : JSON.parse(localBalances);

    if (!balances.length) {
      loadBalancesByAddress(address);
    }
  }, [address, isConnected]);

  return <Provider value={{ balances }}>{children}</Provider>;
};
