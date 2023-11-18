import "./App.css";
import Header from "./components/Header";
import { WalletProvider } from "./context/wallet-context";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./utils/routes";
import { TokensProvider } from "./context/tokens-context";

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <TokensProvider>
        <WalletProvider>
          <Header />
          <div id="page-content">
            <RouterProvider router={router} />
          </div>
        </WalletProvider>
      </TokensProvider>
    </>
  );
}

export default App;
