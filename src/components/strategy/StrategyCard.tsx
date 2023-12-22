import clsx from "clsx";
import { useContext } from "react";
import { useAccount } from "wagmi";

import { Strategy } from "~/utils/interfaces";
import { StrategyContext } from "~/context/strategy-context";

import StrategyCardAPY from "./StrategyCardAPY";
import StrategyCardTVL from "./StrategyCardTVL";
import StrategyCardIcons from "./StrategyCardIcons";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SwapModalContext } from "~/context/swap-modal-context";
import SwapModal from "../modals/SwapModal";

import "./StrategyCard.css";

interface StrategyProps {
  strategyGroup: Strategy[];
}

const StrategyCard = ({ strategyGroup }: StrategyProps) => {

  const web3Modal = useWeb3Modal();
  const { isConnected } = useAccount();

  const [strategy] = strategyGroup;
  const { share: { name } } = strategy;
  const [title, subtitle]  = name.replace("Astrolab ", "").split(" ");

  const { openModal } = useContext(SwapModalContext);
  const { selectStrategy, selectedStrategy } = useContext(StrategyContext);

  const openModalStrategy = async () => {
    selectStrategy(strategy);
    if (!isConnected) {
      await web3Modal.open();
    }
    openModal(<SwapModal />);
  }

  return (
    <div
      className={clsx(
        "card bg-dark h-48 basis-1/3 relative rounded-3xl",
        { active: selectedStrategy?.slug === strategy.slug }
      )}
      onClick={ openModalStrategy }
    >
      <div className="absolute inset-0 flex items-center ms-4 z-0 background-icon-blender">
        <img
          src={strategy.asset.icon}
          className="h-32 w-32"
        />
      </div>
      <div
        className="absolute rounded-3xl inset-0 flex items-center justify-end z-0 background-icon-blender overflow-hidden"
      >
        <img
          src={strategy.network.icon}
          className="h-52 w-52 -mr-16 opacity-25"
        />
      </div>
      <div className="card-body py-3 px-4 z-10">
        <div className="flex flex-row">
          <div className="flex flex-col m-0 p-0 gilroy">
            <div className="font-bold italic text-4xl -mb-1"> { title } </div>
            <div className="font-light"> { subtitle } </div>
          </div>
          <StrategyCardIcons strategyGroup={ strategyGroup } />
        </div>
        <div className="flex flex-row mt-auto">
          <StrategyCardAPY apy={ 23.3 }/>
          <StrategyCardTVL tvl={ 22.3 }/>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
