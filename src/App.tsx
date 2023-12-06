import Header from "./components/Header";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TokensProvider } from "./context/tokens-context";
import routes from "./utils/routes";

import { Web3Provider } from "./context/web3-context.tsx";

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <Web3Provider>
        <TokensProvider>
          <Header />
          <div id="page-content" className="pt-32 relative">
            <RouterProvider router={router} />
            <div className="fixed bottom-0 left-0 w-full flex justify-center z-50">
              <ToastContainer />
            </div>
          </div>
        </TokensProvider>
      </Web3Provider>
    </>
  );
}

export default App;
