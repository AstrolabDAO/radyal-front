import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { clearState } from "../swapper";

const clearStoreMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction) => {
    next(action);
    if (action.type === "modal/closeModal") {
      // clear store
      if (store.getState().modal.list.length === 0)
        store.dispatch(clearState());
    }
  };
export default [clearStoreMiddleware] as Middleware[];
