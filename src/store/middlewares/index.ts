import { Middleware, PayloadAction } from "@reduxjs/toolkit";

export const promiseAwaitingMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction<any>) => {
    if (action.payload instanceof Promise) {
      action.payload.then((res) => {
        action.payload = res;
        store.dispatch(action);
      });
    } else if (action.payload?.promise instanceof Promise) {
      action.payload.promise
        .then(() => {
          delete action.payload.promise;
          store.dispatch(action);
        })
        .catch((e) => console.error(e));
    } else {
      next(action);
    }
  };
