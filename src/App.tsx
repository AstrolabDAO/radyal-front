import { useEffect, useContext } from "react";

import router from "./router/router";
import { RouterProvider } from "react-router-dom";

import { Web3Provider } from "./context/web3-context.tsx";
import { TokensProvider } from "./context/tokens-context";
import { LayoutContext } from "./context/layout-context.tsx";

import Header from "./components/layer/MainHeader.tsx";
import Footer from "./components/layer/MainFooter.tsx";

import { Toaster } from "react-hot-toast";
import LocalStorageService from "./services/localStorage.ts";

function App() {
  const {
    showHeader,
    setShowHeader,
    showFooter,
    setShowFooter
  } = useContext(LayoutContext);

  useEffect(() => {
    const disclaimer = LocalStorageService
      .getItem<boolean>("disclaimerAccepted");
    if (!disclaimer) {
      setShowHeader(false);
      setShowFooter(false);
      router.navigate("/disclaimer");
    }
  }, [setShowHeader, setShowFooter]);

  return (
    <>
      <Web3Provider>
        <TokensProvider>
          <main className="min-h-screen">
            { showHeader && <Header /> }
            <div id="page-content" className="h-full relative">
              <RouterProvider
                router={ router }
              />

              <Toaster
                position="top-right"
                reverseOrder={ false }
              />
            </div>
          </main>
          { showFooter && <Footer /> }
        </TokensProvider>
      </Web3Provider>
    </>
  );
}

export default App;
