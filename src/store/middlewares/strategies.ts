import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { InitPayload } from "../strategies";

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
    return next(action);
  };

export default [addCoingeckoIdMiddleware, groupStrategies] as Middleware[];
