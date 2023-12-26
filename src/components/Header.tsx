import { useAccount } from "wagmi";
import { disconnect } from "wagmi/actions";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { shortenAddress } from "~/utils/format";
import Button from "./Button";

const Header = () => {
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  return (
    <header className="fixed top-0 left-0 w-full flex p-3 bottom-box-shadow z-10">
      <div className="container mx-auto">
        <div className="relative flex w-full">
          <div className="logo h-full relative block">
            <img src="/images/logo.svg" className="flex w-64 fill-white" />
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
