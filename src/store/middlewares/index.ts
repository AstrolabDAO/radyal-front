import { Middleware, PayloadAction } from "@reduxjs/toolkit";

export const promiseAwaitingMiddleware: Middleware =
  (store) => (next) => (action: PayloadAction<any>) => {
    if (action.payload instanceof Promise) {
      action.payload.then((res) => {
        action.payload = res;
        //next(action)
      });
    } else if (action.payload?.promise instanceof Promise) {
      action.payload.promise
        .then(() => {
          delete action.payload.promise;
          next(action)
          //next(action)
        })
        .catch((e) => console.error(e));
    } else {
      next(action);
    }
  };
