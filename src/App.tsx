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
import { useIsMobile } from "./hooks/utils.ts";
import MobileLock from "./pages/MobileLock.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";

function App() {
  const [haveStrokeColor, setHaveStrokeColor] = useState(false);
  const [haveFillColor, setHaveFillColor] = useState(false);
  const isMobile = useIsMobile();

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

  if (isMobile) return <MobileLock />;
  return (
    <>
      <Web3Provider>
        <AppProvider />
        <DisclaimerProvider>
          <HypnoticRing
            haveFillColor={haveFillColor}
            haveStrokeColor={haveStrokeColor}
          />
          <RouterProvider router={router} />
        </DisclaimerProvider>

        <Modal />
      </Web3Provider>
    </>
  );
}

export default App;
