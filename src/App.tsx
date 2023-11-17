import "./App.css";
import { web3Modal } from "./main";

function App() {
  return (
    <>
      {" "}
      <button
        className="btn btn-primary bg-primary"
        onClick={() => web3Modal.open()}
      >
        Connect wallet
      </button>
    </>
  );
}

export default App;
