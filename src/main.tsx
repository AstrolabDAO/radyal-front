import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider, QueryKey } from "react-query";

import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";

import "./styles/index.css";

export const ONE_MINUTE = 1000 * 60;

export const CACHE_TIME = ONE_MINUTE * 5;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: CACHE_TIME,
      staleTime: ONE_MINUTE,
    },
  },
}) as any;

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
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
