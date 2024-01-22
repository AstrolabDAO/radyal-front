import clsx from "clsx";

import { useContext, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { Strategy } from "~/utils/interfaces";

import StrategyCardAPY from "./StrategyCardAPY";
import StrategyCardIcons from "./StrategyCardIcons";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SwapModalContext } from "~/context/swap-modal-context";
import SwapModal from "../modals/SwapModal";

import {
  useSelectStrategy,
  useSelectStrategyGroup,
} from "~/hooks/store/strategies";
import "./StrategyCard.css";

interface StrategyProps {
  strategyGroup: Strategy[];
}

const StrategyCardCTATwo = ({ strategyGroup }: StrategyProps) => {
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

  const [strategy, title, subtitle] = useMemo(() => {
    if (strategyGroup === undefined || strategyGroup.length === 0)
      return [null, null, null];
    const [strategy] = strategyGroup;
    const { name } = strategy;
    const [title, subtitle] = name.replace("Astrolab ", "").split(" ");
    return [strategy, title, subtitle];
  }, [strategyGroup]);

  const selectStrategy = useSelectStrategy();
  const selectGroup = useSelectStrategyGroup();

  const openModalStrategy = () => {
    if (strategy === null) return;
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
        "ms-auto rounded-xl flex w-full h-full lg:w-2/3",
        "strategy-card-cta-two cursor-pointer bg-gray-800",
        "hover:shadow hover:shadow-tertiary",
        { "shine": strategy === null }
      )}
      onClick={openModalStrategy}
    >
      {strategy !== null && (
        <div className="relative flex flex-col w-full mt-auto px-5 pb-4 pt-10">
          <div
            className="absolute items-center flex z-0 background-icon-blender bottom-0 top-0 left-0"
            style={{ right: "15%" }}
          >
            <img src={strategy.asset.icon} className="h-92 w-92 mx-auto" />
          </div>
          <div className="text-6xl gilroy font-bold italic ms-auto text-white">
            {title}
          </div>
          <div className="text-2xl ms-auto text-gray-300">{subtitle}</div>
          <div className="flex flex-row justify-between">
            <StrategyCardIcons
              strategyGroup={strategyGroup}
              hideLabel={true}
              size={{ height: 50, width: 50 }}
            />
            <div className="flex flex-row text-sm btn-primary text-dark rounded-xl my-auto px-10 pb-1 pt-1.5 font-bold italic gilroy">
              <StrategyCardAPY hideLabel={true} apy={23.3} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyCardCTATwo;
