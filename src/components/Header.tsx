import { useAccount } from "wagmi";
import logo from "../assets/logo.svg";

import Button from "./Button";
import { disconnect } from "wagmi/actions";
import { shortenAddress } from "~/utils/format";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const Header = () => {
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  return (
    <header className="fixed top-0 left-0 w-full flex p-3 bottom-box-shadow z-10 bg-white">
      <div className="container mx-auto">
        <div className="relative flex w-full">
          <div className="logo h-full relative block">
            <img src={logo} alt="Logo Radyal" className="flex w-96" />
          </div>
          <nav className="flex w-full justify-end items-center mr-6">
            <ul className="flex font-bold text-xl">
              <li className="px-2 cursor-pointer">Strategies</li>
            </ul>
          </nav>
          <div className="flex justify-end">
            <div className="flex items-center">
              {!isConnected && (
                <Button onClick={() => web3Modal.open()}>Connect wallet</Button>
              )}
              {isConnected && (
                <>
                  <Button
                    className="flex mr-4 cursor-pointer transition-ease hover:text-primary"
                    onClick={() => web3Modal.open()}
                  >
                    {shortenAddress(address.toLowerCase())}
                  </Button>
                  <Button onClick={() => disconnect()}>Logout</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
