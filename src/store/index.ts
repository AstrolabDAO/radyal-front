import { configureStore } from "@reduxjs/toolkit";

import { promiseAwaitingMiddleware } from "./middlewares";
import operationMiddlewares from "./middlewares/operations";
import tokensMiddlewares from "./middlewares/tokens";
import strategiesMiddlewares from "./middlewares/strategies";
import swapperMiddlewares from "./middlewares/swapper";

import { TokenReducer } from "./tokens";
import { OperationReducer } from "./operations";
import { StrategiesReducer } from "./strategies";
import { ModalReducer } from "./modal";
import { SwapperReducer } from "./swapper";
export type IRootState = {
  tokens: ReturnType<typeof TokenReducer>;
  operations: ReturnType<typeof OperationReducer>;
  strategies: ReturnType<typeof StrategiesReducer>;
  modal: ReturnType<typeof ModalReducer>;
  swapper: ReturnType<typeof SwapperReducer>;
};
export const Store = configureStore({
  reducer: {
    operations: OperationReducer,
    tokens: TokenReducer,
    strategies: StrategiesReducer,
    modal: ModalReducer,
    swapper: SwapperReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["operations/emmitStep", "modal/openModal"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["modal/*"],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }).concat(
      promiseAwaitingMiddleware,
      ...operationMiddlewares,
      ...tokensMiddlewares,
      ...strategiesMiddlewares,
      ...swapperMiddlewares
    ),
});

export const getStore = () => {
  return Store;
};
export const getStoreState = () => {
  return Store.getState();
};
