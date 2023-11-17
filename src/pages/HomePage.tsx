import { useContext } from "react";
import { WalletContext } from "../context/wallet-context";

const HomePage = () => {
  const { balances } = useContext(WalletContext);
  return (
    <>
      <h1>I'ts an hello</h1>
      <p>{JSON.stringify(balances)}</p>
    </>
  );
};

export default HomePage;
