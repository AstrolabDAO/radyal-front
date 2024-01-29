import { configureStore } from "@reduxjs/toolkit";

import { promiseAwaitingMiddleware } from "./middlewares";
import operationMiddlewares from "./middlewares/operations";
import tokensMiddlewares from "./middlewares/tokens";
import strategiesMiddlewares from "./middlewares/strategies";
import { TokenReducer } from "./tokens";
import { OperationReducer } from "./operations";
import { StrategiesReducer } from "./strategies";
export type IRootState = {
  tokens: ReturnType<typeof TokenReducer>;
  operations: ReturnType<typeof OperationReducer>;
  strategies: ReturnType<typeof StrategiesReducer>;
};
export const Store = configureStore({
  reducer: {
    operations: OperationReducer,
    tokens: TokenReducer,
    strategies: StrategiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["operations/emmitStep"],
        // Ignore these field paths in all actions
        ignoredActionPaths: [],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }).concat(
      promiseAwaitingMiddleware,
      ...operationMiddlewares,
      ...tokensMiddlewares,
      ...strategiesMiddlewares
    ),
});

export const getStore = () => {
  return Store;
};
export const getStoreState = () => {
  return Store.getState();
};
