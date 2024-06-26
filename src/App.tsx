import { DisclaimerProvider } from "./context/disclaimer-context";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import Modal from "./components/Modal.tsx";
import { AppProvider } from "./context/app.context.tsx";
import { useIsMobile } from "./hooks/utils.ts";
import { useNetworksIsLoading, useWagmiConfig } from "./hooks/web3.ts";
import MobileLock from "./pages/MobileLock.tsx";

import { checkInterval } from "./services/operation";
import { updateIntervalId } from "./store/operations";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import Layout from "./components/layout/Layout.tsx";
import routes from "./router/routes.tsx";

export const ONE_MINUTE = 1000 * 60;
export const CACHE_TIME = ONE_MINUTE * 5;

const doNotPersistQueries = ["estimation" /*"tokens"*/];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: ONE_MINUTE,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient: queryClient as any,
  persister: localStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery: ({ queryKey }) => {
      const can = queryKey.map(
        (k: string) =>
          !doNotPersistQueries.includes(k) || !k.startsWith("estimation")
      );
      return can.includes(true);
    },
  },
});

function App() {
  const isMobile = useIsMobile();
  const networksIsLoading = useNetworksIsLoading();
  const wagmiConfig = useWagmiConfig();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateIntervalId({ intervalId: checkInterval() }));
  }, [dispatch]);

  if (networksIsLoading) return null;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppProvider />
        <DisclaimerProvider>
          <Router>
            <Layout>
              <Switch>
                {routes.map(({ path, element }) => (
                  <Route exact key={path} path={path}>
                    {element}
                  </Route>
                ))}
              </Switch>
            </Layout>
          </Router>
        </DisclaimerProvider>
        <Modal />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
