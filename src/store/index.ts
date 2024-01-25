import { configureStore } from "@reduxjs/toolkit";
import OperationReducer from "~/store/operations";

import { promiseAwaitingMiddleware } from "./middlewares";
import operationMiddlewares from "./middlewares/operations";
export type IRootState = ReturnType<typeof OperationReducer>;

export const Store = configureStore({
  reducer: {
    operations: OperationReducer,
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
    }).concat(promiseAwaitingMiddleware, ...operationMiddlewares),
});

export const getStore = () => {
  return Store;
};
export const getStoreState = () => {
  return Store.getState();
};
