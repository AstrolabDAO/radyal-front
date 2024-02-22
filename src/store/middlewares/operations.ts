import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import LocalStorageService from "~/services/localStorage";
import { checkInterval } from "~/services/operation";
import { CACHE_KEY } from "../operations";

const operationsChangeMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction) => {
    next(action);
    if (
      [
        "operations/add",
        "operations/update",
        "operations/deleteOperation",
      ].includes(action.type)
    ) {
      const state = store.getState().operations;
      LocalStorageService.setItem(
        CACHE_KEY,
        state.list,
        1000 * 60 * 60 * 24 * 30 // 1 month
      );
      store.dispatch({ type: "operations/updateMappings" });
      if (!state.intervalId)
        store.dispatch({
          type: "operations/updateIntervalId",
          payload: {
            intervalId: checkInterval(),
          },
        });
    }
  };

export default [operationsChangeMiddleware] as Middleware[];
