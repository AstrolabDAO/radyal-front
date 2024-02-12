import { Web3Provider } from "./context/web3-context";

import { DisclaimerProvider } from "./context/disclaimer-context";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import HypnoticRing from "./components/HypnoticRing.tsx";
import Modal from "./components/Modal.tsx";
import Layout from "./components/layout/Layout";
import { AppProvider } from "./context/app.context.tsx";
import { checkInterval } from "./services/operation";
import { updateIntervalId } from "./store/operations";

function App() {
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
        <AppProvider />
        <DisclaimerProvider>
          <HypnoticRing
            haveFillColor={haveFillColor}
            haveStrokeColor={haveStrokeColor}
          />
          <Layout changeColor={changeColor} />
        </DisclaimerProvider>

        <Modal />
      </Web3Provider>
    </>
  );
}

export default App;
