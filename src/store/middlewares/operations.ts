import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import LocalStorageService from "~/services/localStorage";
import { CACHE_KEY } from "../operations";

const convertClassToObjectMiddleware: Middleware =
  () => (next) => (action: PayloadAction) => {
    action.payload = Object.assign({}, action.payload);
    next(action);
  };

const operationsChangeMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction) => {
    next(action);
    if (["operations/add", "operations/update"].includes(action.type)) {
      const state = store.getState().operations;
      LocalStorageService.setItem(
        CACHE_KEY,
        state.list,
        1000 * 60 * 60 * 24 * 30 // 1 month
      );
      store.dispatch({ type: "operations/updateMappings" });
      if (!state.intervalId)
        store.dispatch({ type: "operations/listenOperations" });
    }
  };

export default [
  convertClassToObjectMiddleware,
  operationsChangeMiddleware,
] as Middleware[];
