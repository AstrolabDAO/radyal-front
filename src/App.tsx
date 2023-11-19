import "./App.css";
import Header from "./components/Header";
import { WalletProvider } from "./context/wallet-context";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TokensProvider } from "./context/tokens-context";
import { SwapProvider } from "./context/swap-context";
import routes from "./utils/routes";

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
            </div>
          </SwapProvider>
        </WalletProvider>
      </TokensProvider>
    </>
  );
}

export default App;
