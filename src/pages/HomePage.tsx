import { useContext } from "react";
import { WalletContext } from "../context/wallet-context";

const HomePage = () => {
  const { balances } = useContext(WalletContext);

  const convertEthers = (bigInt: bigint, decimals) => {
    return Number(bigInt) / 10 ** decimals;
  };

  return (
    <>
      <h1>I'ts an hello</h1>
      <h2>Balances: </h2>
      <ul>
        {balances.map((balance) => {
          return (
            <li>
              {balance.network.name} {"->"} {balance.address} :{" "}
              {convertEthers(balance.amount, balance.decimals)} {balance.symbol}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default HomePage;
