import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { fetchStrategiesBalances } from "../api/astrolab";
import { IRootState } from "..";
import localforage from "localforage";
import { setConfig } from "../web3";
import { networkToWagmiChain } from "~/utils/format";

const loadStrategiesBalancesMiddleware: Middleware =
  (store: any) => (next) => (action: PayloadAction<any>) => {
    next(action);

    const state: IRootState = store.getState();
    if (!state.web3.connectedAddress || state.strategies.isLoading) return;
    if (
      [
        "web3/setConnectedAddress",
        "strategies/init",
        "astrolab/strategies/fulfilled",
      ].includes(action.type)
    ) {
      store.dispatch(fetchStrategiesBalances());
    }
  };

const persistAPIDataMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction<any>) => {
    next(action);
    const regex = new RegExp(/^astrolab\/(.*)\/fulfilled$/);
    if (regex.test(action.type)) {
      const match = action.type.match(regex);
      localforage.setItem(match[1], JSON.stringify(action.payload));
    }
  };

export default [
  loadStrategiesBalancesMiddleware,
  persistAPIDataMiddleware,
] as Middleware[];
