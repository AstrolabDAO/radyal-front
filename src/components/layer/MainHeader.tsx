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

const Header = () => {
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 20 ? true : false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx("sticky top-0 w-full p-1 z-50", {
        "scrolled": scrolling,
      })}
    >
      <div className="container">
        <div className="navbar">
          <Link to="/" className="navbar-start">
            <Logo className="flex fill-white w-52" />
          </Link>
          <nav className="navbar-center text-secondary flex-row justify-center gap-10 hidden sm:flex ">
            <Link
              to="/"
              className="text-xl flex font-bold hover:text-white text-neon cursor-pointer"
            >
              VAULTS
            </Link>
            <div className="text-xl flex hover:text-white cursor-pointer">
              BORROW
            </div>
            <div className="text-xl flex cursor-pointer hover:text-white">
              FOLIO
            </div>
            <div className="text-xl flex cursor-pointer relative">
              <HeaderAbout />
            </div>
          </nav>
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
