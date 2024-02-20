import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { clearState, setOnWrite } from "../swapper";

const clearStoreMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction) => {
    next(action);
    if (action.type === "modal/close") {
      // clear store
      if (store.getState().modal.list.length === 0)
        store.dispatch(clearState());
    }
  };

const debounceTimerMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction) => {
    next(action);
    if (action.type === "swapper/setFromValue") {
      const { debounceTimer } = store.getState().swapper;
      if (debounceTimer) clearTimeout(debounceTimer);
      store.dispatch(
        setOnWrite({
          onWrite: true,
          debounceTimer: setTimeout(() => {
            store.dispatch(
              setOnWrite({
                onWrite: false,
              })
            );
          }, 1000),
        })
      );
    }
  };
export default [clearStoreMiddleware, debounceTimerMiddleware] as Middleware[];
