import "./App.css";
import Header from "./components/Header";
import { WalletProvider } from "./context/wallet-context";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TokensProvider } from "./context/tokens-context";
import { SwapProvider } from "./context/swap-context";
import routes from "./utils/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter(routes);
function App() {
  return (
    <>
      <TokensProvider>
        <WalletProvider>
          <SwapProvider>
            <Header />
            <div id="page-content" className="pt-32 relative">
              <RouterProvider router={router} />
              <div className="fixed bottom-0 left-0 w-full flex justify-center z-50">
                <ToastContainer />
              </div>
            </div>
          </SwapProvider>
        </WalletProvider>
      </TokensProvider>
    </>
  );
}

export default App;
