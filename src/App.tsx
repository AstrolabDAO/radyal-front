import { Web3Provider } from "./context/web3-context";

import { DisclaimerProvider } from "./context/disclaimer-context";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Layout from "./components/layout/Layout";
import { useReduxStoreDataInit } from "./hooks/store/store";
import { checkInterval } from "./services/operation";
import { updateIntervalId } from "./store/operations";
// import Julia from "./components/extra/Julia.tsx";
import HypnoticRing from "./components/HypnoticRing.tsx";

function App() {
  useReduxStoreDataInit();
  const [haveStrokeColor, setHaveStrokeColor] = useState(false);
  const [haveFillColor, setHaveFillColor] = useState(false);

  let debounceTimer: NodeJS.Timeout;
  function changeColor() {
    clearTimeout(debounceTimer);

    setHaveFillColor(true);
    setHaveStrokeColor(true);

    debounceTimer = setTimeout(() => {
        setHaveFillColor(false);
        setHaveStrokeColor(false);
    }, 1000);
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateIntervalId({ intervalId: checkInterval() }));
  }, [dispatch]);

  return (
    <>
      <Web3Provider>
        <DisclaimerProvider>
          <HypnoticRing
            haveFillColor={ haveFillColor }
            haveStrokeColor={ haveStrokeColor }
          />
          <Layout
            changeColor={ changeColor }
          />
        </DisclaimerProvider>
        {/* <Julia /> */}
      </Web3Provider>
    </>
  );
}

export default App;
