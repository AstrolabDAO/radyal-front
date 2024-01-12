import { TokensProvider } from "./context/tokens-context";
import { Web3Provider } from "./context/web3-context";

import { DisclaimerProvider } from "./context/disclaimer-context";

import Layout from "./components/layout/Layout";

function App() {
  return (
    <>
      <Web3Provider>
        <TokensProvider>
          <DisclaimerProvider>
            <Layout />
          </DisclaimerProvider>
        </TokensProvider>
      </Web3Provider>
    </>
  );
}

export default App;
