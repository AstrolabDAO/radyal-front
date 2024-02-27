import { PayloadAction, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  convertClassToObjectMiddleware,
  promiseAwaitingMiddleware,
} from "./middlewares";
import operationMiddlewares from "./middlewares/operations";
import strategiesMiddlewares from "./middlewares/strategies";
import swapperMiddlewares from "./middlewares/swapper";
import tokensMiddlewares from "./middlewares/tokens";
import astrolabMiddlewares from "./middlewares/astrolab";

import { initStore } from "./api/astrolab";
import { ModalReducer } from "./modal";
import { OperationReducer } from "./operations";
import { StrategiesReducer } from "./strategies";
import { SwapperReducer } from "./swapper";
import { TokenReducer } from "./tokens";
import { Web3Reducer } from "./web3";
import localforage from "localforage";

//import reduxApis, { endpoints } from "./api/api";
export type IRootState = {
  tokens: ReturnType<typeof TokenReducer>;
  operations: ReturnType<typeof OperationReducer>;
  strategies: ReturnType<typeof StrategiesReducer>;
  modal: ReturnType<typeof ModalReducer>;
  swapper: ReturnType<typeof SwapperReducer>;
  web3: ReturnType<typeof Web3Reducer>;
};

localforage.config({
  driver: localforage.INDEXEDDB, // Utiliser IndexedDB
  name: "redux-store",
  storeName: "reduxStore", // Nom du store IndexedDB
});

export const store = configureStore({
  reducer: {
    operations: OperationReducer,
    tokens: TokenReducer,
    strategies: StrategiesReducer,
    modal: ModalReducer,
    swapper: SwapperReducer,
    web3: Web3Reducer,
    //...apiReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      convertClassToObjectMiddleware,
      promiseAwaitingMiddleware,
      ...operationMiddlewares,
      ...tokensMiddlewares,
      ...strategiesMiddlewares,
      ...swapperMiddlewares,
      ...astrolabMiddlewares
    ),
});
setupListeners(store.dispatch);
initStore(store);

export const dispatch = (action: PayloadAction<any>) => store.dispatch(action);

export const getStoreState = () => {
  return store.getState();
};
