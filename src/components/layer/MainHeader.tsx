import { useAccount } from "wagmi";
import { disconnect } from "wagmi/actions";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { shortenAddress } from "~/utils/format";
import Button from "../Button";
import Logo from "~/assets/logo.svg?react";

const Header = () => {
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  return (
    <header>
      <div className="fixed navbar bg-base-100 z-10">
        <div className="navbar-start">
          <Logo className="flex w-64 fill-white" />
        </div>
        <div className="navbar-end">
          { !isConnected && (
            <Button onClick={() => web3Modal.open()}>Connect wallet</Button>
          )}
          { isConnected && (
            <>
              <Button
                className="mr-4 transition-ease hover:text-primary"
                onClick={() => web3Modal.open()}
              >
                {shortenAddress(address.toLowerCase())}
              </Button>
              <Button onClick={() => disconnect()}>Logout</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;