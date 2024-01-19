import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { shortenAddress } from "~/utils/format";

import Button from "../Button";
import Logo from "~/assets/logo/logo.svg?react";

const Header = () => {
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerStyle = {
    height: '90px',
    backgroundColor: scrolling ? 'oklch(0.222129 0 0)' : 'transparent',
    transition: 'background-color 0.3s ease-in-out',
    // Add other styles for your header here
  };

  return (
    <header
      className="sticky top-0 z-20"
      style={ headerStyle }
    >
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <Logo
            className="flex w-32 md:w-64 fill-white"
            onClick={() => window.location.replace("/disclaimer")}
          />
        </div>
        <div className="navbar flex flex-row justify-center gap-10">
          <div className="text-xl flex font-extrabold text-white text-neon">
            FARM
          </div>
          <div className="text-xl flex">
            STAKE
            <div className="badge badge-outline border-2 badge-xs px-1 mb-auto text-2xs">
              Soon™
            </div>
          </div>
          <div className="text-xl flex">
            MINT
            <div className="badge badge-outline border-2 badge-xs px-1 mb-auto text-2xs">
              Soon™
            </div>
          </div>
        </div>
        <div className="navbar-end">
          { !isConnected && (
            <Button onClick={() => web3Modal.open()}>Connect wallet</Button>
          )}
          { isConnected && (
            <>
              <Button
                className="transition-ease hover:text-primary h-4 btn-small"
                onClick={() => web3Modal.open()}
              >
                { shortenAddress(address.toLowerCase()) }
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
