import { Web3Provider } from "./context/web3-context";

import { DisclaimerProvider } from "./context/disclaimer-context";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Layout from "./components/layout/Layout";
import { useReduxStoreDataInit } from "./hooks/store/store";
import { checkInterval } from "./services/operation";
import { updateIntervalId } from "./store/operations";
// import Julia from "./components/extra/Julia.tsx";
import HypnoticRing from "./components/HypnoticRing.tsx";

function App() {
  useReduxStoreDataInit();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateIntervalId({ intervalId: checkInterval() }));
  }, [dispatch]);

  return (
    <>
      <Web3Provider>
        <DisclaimerProvider>
          <HypnoticRing />
          <Layout />
        </DisclaimerProvider>
        {/* <Julia /> */}
      </Web3Provider>
    </>
  );
}

export default App;
