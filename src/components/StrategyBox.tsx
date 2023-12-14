import { Strategy } from "~/utils/interfaces";
import IconGroup from "./IconGroup";
import StrategyData from "./StrategyData";
import { useContext } from "react";
import { StrategyContext } from "~/context/strategy-context";
import clsx from "clsx";
import { useAccount } from "wagmi";

import SwapModal from "./modals/SwapModal";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SwapModalContext } from "~/context/swap-modal-context";

interface StrategyProps {
  strategy: Strategy;
}
const StrategyCard = ({ strategy }: StrategyProps) => {
  const { network, token, name } = strategy;
  const { selectStrategy, selectedStrategy } = useContext(StrategyContext);
  const { openModal } = useContext(SwapModalContext);

  const { isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  const icons = [
    {
      url: token.icon,
      alt: token.symbol,
      classes: "border-primary",
    },
    {
      url: network.icon,
      alt: network.name,
      small: true,
      classes: "border-primary",
    },
  ];
  return (
    <li className="w-full md:w-1/2 xl:w-1/3 strategy-box">
      <div
        className={clsx(
          "card bg-base-100 shadow-xl w-full p-2 cursor-pointer transition-500 active-bordered active-shadow",
          { active: selectedStrategy?.slug === strategy.slug }
        )}
        onClick={() => {
          selectStrategy(strategy);
          if (!isConnected)
            web3Modal.open().then(() => openModal(<SwapModal />));
          else openModal(<SwapModal />);
        }}
      >
        <div className="card-body p-4">
          <h2 className="card-title">
            <IconGroup icons={icons} />
            {name}
          </h2>
          <ul className="infos flex mt-6">
            <StrategyData label="APR" data="12.31%" />
            <StrategyData label="Positions" data="0.00$" />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default StrategyCard;
