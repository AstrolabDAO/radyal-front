import { TokensProvider } from "./context/tokens-context";
import { Web3Provider } from "./context/web3-context";

import { DisclaimerProvider } from "./context/disclaimer-context";

import { useEffect } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import Layout from "./components/layout/Layout";
import { Store } from "./store";
import { updateIntervalId } from "./store/operations";
import { checkInterval } from "./services/operation";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateIntervalId({ intervalId: checkInterval() }));
  }, [dispatch]);
  return (
    <>
      <Web3Provider>
        <ReduxProvider store={Store}>
          <TokensProvider>
            <DisclaimerProvider>
              <Layout />
            </DisclaimerProvider>
          </TokensProvider>
        </ReduxProvider>
      </Web3Provider>
    </>
  );
}

export default App;
