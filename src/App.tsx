import "./App.css";
import Header from "./components/Header";
import { WalletProvider } from "./context/wallet-context";

function App() {
  return (
    <>
      <WalletProvider>
        <Header />
      </WalletProvider>
    </>
  );
}

export default App;
