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
import clsx from "clsx";

interface StrategyProps {
  strategyGroup: Strategy[];
}

const StrategyCardCTAOne = ({ strategyGroup }: StrategyProps) => {
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
    selectStrategy(strategy as Strategy);
    selectGroup(strategyGroup);
    if (!isConnected) {
      web3Modal.open();
      setShouldOpenModal(true);
    }
    else openModal(<SwapModal />);
  }
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div
      onClick={ openModalStrategy }
    >
      <div className="relative flex flex-col w-full" style={{ width: '45rem', maxWidth: '100%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5044 2243" fill="none">
          <defs>
            <path
              id="border-path"
              d="M4 150C4 69.3664 69.3664 4 150 4H4894C4974.63 4 5040 69.3664 5040 150V647.011C5040 711.253 4998.01 767.947 4936.55 786.671L192.554 2232.15C98.7492 2260.73 4 2190.55 4 2092.49V150Z"
            />
            <linearGradient id="gradient" x1="0%" y1="100%" x2="200%" y2="0" >
            <stop offset="0" stopColor="rgba(255, 255, 255, 0.3)">
                <animate attributeName="offset" values="0;0.8" dur="1s" repeatCount="indefinite" />
            </stop>

            <stop offset="0" stopColor="rgba(255, 255, 255, 0.3)">
                <animate attributeName="offset" values="0;0.8" dur="1s" repeatCount="indefinite" />
            </stop>

            <stop offset="0.1" stopColor="rgba(255, 255, 255, 0.4)">
                <animate attributeName="offset" values="0.1;1" dur="1s" repeatCount="indefinite" />
            </stop>

            <stop offset="0.1" stopColor="rgba(255, 255, 255, 0.4)">
                <animate attributeName="offset" values="0.1;1" dur="1s" repeatCount="indefinite" />
            </stop>
            </linearGradient>
          </defs>
          <clipPath id="clip">
            <use xlinkHref="#border-path" />
          </clipPath>
            <path
              className="cursor-pointer"
              d="M4 150C0 67.1573 67.1573 0 150 0H4894C4976.84 0 5044 67.1573 5044 150V647.011C5044 713.013 5000.86 771.26 4937.72 790.498L193.72 2235.97C97.3451 2265.34 0 2193.24 0 2092.49V150Z"
              fill={ strategy === null ? "url(#gradient)" : (isHovered ? "rgba(255, 184, 0, 0.1)" : "#1E1E1E") }
              onMouseEnter={ () => setIsHovered(true) }
              onMouseLeave={ () => setIsHovered(false) }
            />
            <use
              className="transition-all duration-500 ease-in-out"
              xlinkHref="#border-path"
              stroke={ `var(--${isHovered ? 'primary' : 'secondary'})`}
              strokeWidth={ isHovered ? '6px' : '2px' }
            />
            { strategy !== null &&
              <image
                className="grayscale pointer-events-none transition-all duration-500 ease-in-out"
                width={ '100%' }
                height={ '100%' }
                y={ '-15%' }
                opacity={ 0.2 }
                clipPath="url(#clip)"
                href={ strategy.asset.icon }
              />
            }
        </svg>
        { strategy !== null &&
        <div className="absolute flex flex-col w-full pointer-events-none">
          <div className="flex flex-row justify-between px-5 pt-5">
            <div className={ clsx(
              "me-auto text-6xl gilroy font-extrabold italic",
              `${isHovered ? "text-primary" : "text-white"}`,
            )}>
              { title.toUpperCase() }
            </div>
            <StrategyCardIcons
              strategyGroup={ strategyGroup }
              hideLabel={ true }
              size={{ height: 45, width: 45 }}
            />
          </div>
          <div className="text-5xl gilroy italic me-auto text-gray-300 px-5 mb-3">
            { subtitle }
          </div>
          <div className="flex flex-row justify-between px-5">
            <div className="flex flex-row text-sm btn-primary text-dark rounded-xl my-auto px-10 pb-1 pt-1.5 font-bold italic gilroy">
              <StrategyCardAPY
                hideLabel={ true }
                apy={ 23.3 }
              />
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default StrategyCardCTAOne;
