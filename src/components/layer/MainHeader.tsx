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
      className={clsx("sticky top-0 w-full p-1 z-40", {
        scrolled: scrolling,
      })}
    >
      <div className="container">
        <div className="navbar">
          <Link to="/" className="navbar-start">
            <Logo className="flex fill-white w-52" />
          </Link>
          <nav className="text-xl navbar-center text-secondary flex-row justify-center gap-6 px-5 hidden sm:flex ">
            <Link
              to="/"
              className="flex font-bold hover:text-primary text-neon cursor-pointer font-bold"
            >
              VAULTS
            </Link>
            <div
              className="flex cursor-not-allowed font-medium text-darkGrey tooltip tooltip-bottom"
              data-tip="Soon™"
            >
              BORROW
            </div>
            <Link
              to={"/folio"}
              className="flex font-medium tooltip tooltip-bottom"
            >
              FOLIO
            </Link>
            <div className="flex cursor-pointer relative">
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
