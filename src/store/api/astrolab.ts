import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import localforage from "localforage";
import { getAccount } from "wagmi/actions";
import { NetworksResponse, ProtocolsResponse } from "~/interfaces/astrolab-api";
import {
  getStrategies,
  getStrategiesBalancesFromApi,
} from "~/services/strategies";
import { getNetworks, getWagmiConfig } from "~/services/web3";
import {
  formatNetworks,
  formatProtocols,
  getStrategies as getStrategiesFromAPI,
} from "~/utils/api";
import { setConfig, setNetworks, setProtocols } from "../web3";
import { init } from "../strategies";
import { networkToWagmiChain } from "~/utils/format";
import { Network, NetworkInterface } from "~/model/network";
import { Strategy, IStrategy } from "~/model/strategy";
import { Protocol, IProtocol } from "~/model/protocol";
import { setupWeb3modal } from "~/utils/setup-web3modal";
import { store } from "..";
import { addBalances } from "../tokens";

const refetchInterval = (fetchingFunction: CallableFunction, timer: number) => {
  return setInterval(fetchingFunction, timer);
};
export const initStore = async (store) => {
  try {
    const localNetworks: NetworkInterface[] = JSON.parse(
      await localforage.getItem("networks")
    );
    const localStrategies: IStrategy[] = JSON.parse(
      await localforage.getItem("strategies")
    );
    const localProtocols: IProtocol[] = JSON.parse(
      await localforage.getItem("protocols")
    );
    const localStrategiesBalances = JSON.parse(
      await localforage.getItem("strategiesBalances")
    );
    if (!localNetworks || !localStrategies || !localProtocols) throw Error();
    store.dispatch(setNetworks(localNetworks.map((n) => new Network(n))));
    store.dispatch(setProtocols(localProtocols.map((p) => new Protocol(p))));
    const chains = localNetworks.map((network) => networkToWagmiChain(network));

    store.dispatch(setConfig(setupWeb3modal(chains) as any));
    store.dispatch(
      init({
        strategies: localStrategies.map((s) => new Strategy(s)),
      })
    );
    store.dispatch(addBalances(localStrategiesBalances));
  } catch (err) {
    Promise.all([
      store.dispatch(fetchNetworks()).unwrap(),
      store.dispatch(fetchProtocols()).unwrap(),
    ]).then(() => {
      store.dispatch(fetchStrategies());
    });
  }

  refetchInterval(
    () => {
      store.dispatch(fetchStrategies());
    },
    1000 * 60 * 5 // 5 minutes
  );
  refetchInterval(() => {
    store.dispatch(fetchStrategiesBalances());
  }, 1000 * 60); // 1 minute
};

export const fetchNetworks = createAsyncThunk(
  "astrolab/networks",
  async (_arg, { rejectWithValue }) => {
    try {
      //?slugs=${JSON.stringify(NETWORKS)}
      const result = await axios.get<NetworksResponse>(
        `${process.env.ASTROLAB_API}/networks`
      );

      const networks = await formatNetworks(result.data);
      const chains = networks.map((n) => networkToWagmiChain(n));

      const config = setupWeb3modal(chains) as any;

      store.dispatch(setConfig(config));
      return networks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProtocols = createAsyncThunk(
  "astrolab/protocols",
  async (_arg, { rejectWithValue }) => {
    try {
      const result = await axios.get<ProtocolsResponse>(
        `${process.env.ASTROLAB_API}/protocols`
      );
      return formatProtocols(result.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStrategies = createAsyncThunk(
  "astrolab/strategies",
  async (arg, { rejectWithValue }) => {
    try {
      const strategies = await getStrategiesFromAPI();
      return strategies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStrategiesBalances = createAsyncThunk(
  "astrolab/strategiesBalances",
  async (arg, { rejectWithValue }) => {
    try {
      const wagmiConfig = getWagmiConfig();
      const { address } = getAccount(wagmiConfig);
      const strategies = getStrategies();
      return getStrategiesBalancesFromApi(address, strategies);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
