import { useAccount } from "wagmi";
import logo from "../assets/logo.svg";
import { web3Modal } from "../main";
import Button from "./Button";
import { disconnect } from "wagmi/actions";

const Header = () => {
  const { address, isConnected } = useAccount();
  web3Modal;

  return (
    <header className="fixed top-0 left-0 w-full flex p-3 bottom-box-shadow">
      <div className="container mx-auto">
        <div className="relative flex w-full">
          <div className="logo h-full relative block">
            <img src={logo} alt="Logo Radyal" className="flex h-12" />
          </div>
          <nav className="flex w-full justify-end">
            <ul className="flex"></ul>
          </nav>
          <div className="flex justify-end">
            {!isConnected && (
              <Button onClick={() => web3Modal.open()}>Connect wallet</Button>
            )}
            {isConnected && (
              <div className="flex">
                <span>{address}</span>
                <Button onClick={() => disconnect()}>Logout</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
