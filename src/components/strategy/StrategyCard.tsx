import clsx from "clsx";
import { useContext, useState } from "react";
import { useAccount } from "wagmi";

import { Strategy } from "~/utils/interfaces";

import StrategyCardAPY from "./StrategyCardAPY";
import StrategyCardIcons from "./StrategyCardIcons";
import StrategyCardTVL from "./StrategyCardTVL";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SwapModalContext } from "~/context/swap-modal-context";
import SwapModal from "../modals/SwapModal";

import {
  useSelectStrategy,
  useSelectStrategyGroup,
  useSelectedStrategy,
} from "~/hooks/store/strategies";
import "./StrategyCard.css";

interface StrategyProps {
  strategyGroup: Strategy[];
}
const StrategyCard = ({ strategyGroup }: StrategyProps) => {
  const web3Modal = useWeb3Modal();
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);

  const { openModal } = useContext(SwapModalContext);

  // handleConnect is called when the user connects to the wallet
  // isReconnected is true if the user was already connected
  const handleConnect = ({ isReconnected }) => {
    if (!isReconnected && isConnected && shouldOpenModal) {
      openModal(<SwapModal />);
    }
  };

  const { isConnected } = useAccount({ onConnect: handleConnect });

  const [strategy] = strategyGroup;
  const { name } = strategy;
  const [title, ...subtitle] = name.replace("Astrolab ", "").split(" ");

  const selectedStrategy = useSelectedStrategy();
  const selectGroup = useSelectStrategyGroup();
  const selectStrategy = useSelectStrategy();

  const openModalStrategy = () => {
    selectStrategy(strategy);
    selectGroup(strategyGroup);
    if (!isConnected) {
      web3Modal.open();
      setShouldOpenModal(true);
    } else openModal(<SwapModal />);
  };

  return (
    <div
      className={clsx(
        "card group bg-dark-600 h-48 basis-1/3 relative rounded-3xl cursor-pointer border-2 border-dark-500",
        "border-2 border-dark-500 border-solid",
        "hover:text-white hover:shadow-sm hover:shadow-secondary hover:bg-tertiary-700 hover:border-tertiary-800",
        "transition-all duration-700",
        { active: selectedStrategy?.slug === strategy.slug }
      )}
      onClick={openModalStrategy}
    >
      <div className="absolute inset-0 flex items-center ms-4 z-0 background-icon-blender">
        <img src={strategy.asset.icon} className="h-32 w-32" />
      </div>
      <div className="absolute rounded-3xl inset-0 flex items-center justify-end z-0 background-icon-blender overflow-hidden">
        <img
          src={strategy.network.icon}
          className="h-52 w-52 -mr-16 opacity-25"
        />
      </div>
      <div className="card-body py-3 px-4 z-10 group-hover:text-dark-600">
        <div className="flex flex-row w-full">
          <div className="flex flex-col m-0 p-0 gilroy w-full">
            <div className="font-bold italic uppercase text-4xl -mb-1">
              {title}
            </div>
            <div className="flex flex-row">
              <div className="flex font-light me-auto my-auto">
                {" "}
                {subtitle.join(" ")}{" "}
              </div>
              <StrategyCardIcons strategyGroup={strategyGroup} />
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-auto">
          <StrategyCardAPY apy={23.3} />
          <StrategyCardTVL tvl={22.3} />
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
