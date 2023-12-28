import Header from "./components/layer/MainHeader.tsx";
import Footer from "./components/layer/MainFooter.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TokensProvider } from "./context/tokens-context";
import routes from "./utils/routes";

import { Web3Provider } from "./context/web3-context.tsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <Web3Provider>
        <TokensProvider>
          <Header />
          <div id="page-content" className="pt-32 relative">
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              reverseOrder={false}
              /* toastOptions={{
                style: {
                  background: BACKGROUNDS["base-100"],
                },
              }}*/
            />
          </div>
          <Footer />
        </TokensProvider>
      </Web3Provider>
    </>
  );
}

export default App;
