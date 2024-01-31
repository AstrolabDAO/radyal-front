import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { shortenAddress } from "~/utils/format";

import Button from "../Button";
import Logo from "~/assets/logo/logo.svg?react";

const Header = ({ emitMint }) => {
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
    height: scrolling ? '3.61rem' : '5rem',
    backgroundColor: scrolling ? 'rgba(28, 28, 28, 0.6)' : 'transparent',
    backdropFilter: scrolling ? 'blur(10px)' : 'none',
    transition: 'background-color 0.3s ease-in-out',
    // Add other styles for your header here
  };

  return (
    <header
      className="sticky top-0 z-20 w-full"
      style={ headerStyle }
    >
      <div className="container">
        <div className="navbar overflow-hidden">
          <div className="navbar-start">
            <Logo
              className="flex fill-white w-36"
            />
          </div>
          <div className="navbar-center flex-row justify-center gap-10 hidden sm:flex">
            <a
              href="/"
              className="text-xl flex font-extrabold text-white text-neon cursor-pointer hover:text-primary">
              FARM
            </a>
            <div className="text-xl flex text-gray-500 cursor-default">
              STAKE
            </div>
            <div className="text-xl flex text-gray-500 hover:text-gray-600 cursor-default"
              onClick={ () => emitMint() }
            >
              MINT
            </div>
          </div>
          <div className="navbar-end">
            { !isConnected && (
              <Button onClick={() => web3Modal.open()}>Connect wallet</Button>
            )}
            { isConnected && (
              <>
                <Button
                  className="h-10 min-h-0 rounded-xl"
                  onClick={() => web3Modal.open()}
                >
                  { shortenAddress(address.toLowerCase()) }
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
