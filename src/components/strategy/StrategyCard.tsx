import clsx from "clsx";
import { useContext, useMemo, useState } from "react";
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
import { getIconFromStrategy } from "~/utils";
import { Web3Context } from "~/context/web3-context";

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
  const [title, ...subtitle] = name
    .replace(/\b(Astrolab |v2|v3)\b/g, "").split(" ");

  const selectedStrategy = useSelectedStrategy();
  const selectGroup = useSelectStrategyGroup();
  const selectStrategy = useSelectStrategy();

  const openModalStrategy = () => {
    selectStrategy(strategy);
    selectGroup(strategyGroup);
    if (!isConnected) {
      web3Modal.open();
      setShouldOpenModal(true);
    }
    else openModal(<SwapModal />);
  }
  const protocols = useContext(Web3Context).protocols;
  const strategyIconPath = (getIconFromStrategy(strategy, protocols).replace('.svg', '-mono.svg'));
  const assetIconPath = useMemo(() => {
    return strategy.asset.icon.substring(0, strategy.asset.icon.length - 4) + "-mono.svg";
  }, [strategy]);
  return (
    <div
      className={clsx(
        "card group strategy-card text-secondary-900",
        { active: selectedStrategy?.slug === strategy.slug }
      )}
      onClick={openModalStrategy}
    >
      <div className="absolute inset-0 flex top-7 left-5 z-0 contrast-63 group-hover:contrast-100">
        <img
          src={ assetIconPath }
          className="h-20 w-20 strategy-icon-filter"
        />
      </div>
      <div
        className="absolute rounded-3xl inset-0 flex items-center justify-end z-0 overflow-hidden contrast-63 group-hover:contrast-100"
      >
        <img
          src={ strategyIconPath }
          className="h-52 w-52 -mr-16 strategy-icon-filter"
        />
      </div>
      <div className="card-body py-4 px-5 z-10">
        <div className="flex flex-row w-full">
          <div className="flex flex-col m-0 p-0 gilroy w-full">
            <div className="flex flex-row">
              <div className="font-extrabold italic uppercase text-4xl -mb-1 group-hover:text-primary me-auto">
                { title }
              </div>
              <StrategyCardIcons strategyGroup={ strategyGroup } />
            </div>
            <div className="flex font-light text-secondary-400 my-auto text-2xl"> { subtitle.join(' ') } </div>
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
