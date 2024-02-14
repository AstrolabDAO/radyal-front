import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { shortenAddress } from "~/utils/format";

import Logo from "~/assets/logo/logo.svg?react";

import HeaderActions from "./header/HeaderActions";
import HeaderAbout from "./header/HeaderAbout";
import clsx from "clsx";
import { Button } from "../styled";
import { Link } from "react-router-dom";

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
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={clsx("sticky top-0 z-20 w-full p-1", {
        "border-b border-b-1 border-solid scrolled": scrolling,
      })}
    >
      <div className="container">
        <div className="navbar">
          <Link to="/" className="navbar-start">
            <Logo className="flex fill-white w-36" />
          </Link>
          <div className="navbar-center flex-row justify-center gap-10 hidden sm:flex">
            <Link
              to="/"
              className="text-xl flex font-bold text-white text-neon cursor-pointer hover:text-primary"
            >
              VAULTS
            </Link>
            <div
              className="text-xl flex text-gray-500 hover:text-gray-600 cursor-default"
              onClick={() => emitMint()}
            >
              BORROW
            </div>
            <div className="text-xl flex text-gray-500 cursor-default">
              FOLIO
            </div>
            <div className="text-xl flex text-gray-500 cursor-default relative">
              <HeaderAbout />
            </div>
          </div>
          <div className="navbar-end uppercase">
            {!isConnected && (
              <Button onClick={() => web3Modal.open({ view: "Connect" })}>
                Connect
              </Button>
            )}
            {isConnected && (
              <>
                <HeaderActions />
                <Button
                  primary={false}
                  onClick={() => web3Modal.open({ view: "Account" })}
                >
                  {shortenAddress(address.toLowerCase())}
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
