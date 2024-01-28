import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider, QueryKey } from "react-query";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { Provider as ReduxProvider } from "react-redux";
import { Store } from "./store";
import App from "./App.tsx";

import "./styles/index.css";
import { Web3Provider } from "./context/web3-context.tsx";

export const ONE_MINUTE = 1000 * 60;

export const CACHE_TIME = ONE_MINUTE * 5;
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: CACHE_TIME,
      staleTime: ONE_MINUTE,
    },
  },
});

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage,
});
const doNotPersistQueries: QueryKey[] = [];

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
  maxAge: CACHE_TIME,
  hydrateOptions: {},
  dehydrateOptions: {
    shouldDehydrateQuery: ({ queryKey }) => {
      return !doNotPersistQueries.includes(queryKey);
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <ReduxProvider store={Store}>
          <App />
        </ReduxProvider>
      </Web3Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
