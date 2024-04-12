import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { InitPayload } from "../strategies";
import { getStoreState } from "..";
import { Strategy } from "~/model/strategy";

const addCoingeckoIdMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction<InitPayload>) => {
    next(action);
    if (action.type === "strategies/init") {
      store.dispatch({
        type: "tokens/addRequestedPriceCoingeckoIds",
        payload: action.payload.strategies.map(
          ({ asset }) => asset.coinGeckoId
        ),
      });
    }
  };

const groupStrategies: Middleware =
  (store) => (next) => (action: PayloadAction) => {
    next(action);
    if (action.type === "strategies/init") {
      store.dispatch({
        type: "strategies/groupStrategies",
      });
    }
  };
const updateStrategiesBalancesMapping: Middleware =
  () => (next) => (action: PayloadAction) => {
    next(action);
    if (
      [
        "astrolab/strategiesBalances/fulfilled",
        "strategies/updateStrategiesPrices",
      ].includes(action.type)
    ) {
      getStoreState().strategies.strategiesBalances.forEach(
        (balance) => (Strategy.balanceBySlug[balance.token] = balance)
      );
    }
  };

export default [
  addCoingeckoIdMiddleware,
  groupStrategies,
  updateStrategiesBalancesMapping,
] as Middleware[];
