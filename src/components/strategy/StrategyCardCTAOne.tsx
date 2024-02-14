import clsx from "clsx";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { getIconFromStrategy } from "~/utils";
import { Strategy } from "~/utils/interfaces";

import StrategyCardAPY from "./StrategyCardAPY";
import StrategyCardIcons from "./StrategyCardIcons";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import ActionModal from "../modals/ActionModal";

import "./StrategyCard.css";
import { getRandomAPY } from "~/utils/mocking";
import { openModal } from "~/services/modal";
import { selectStrategy, selectStrategyGroup } from "~/services/strategies";
import { Button } from "../styled";

interface StrategyProps {
  strategyGroup: Strategy[];
}

const StrategyCardCTAOne = ({ strategyGroup }: StrategyProps) => {
  const web3Modal = useWeb3Modal();
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);

  // handleConnect is called when the user connects to the wallet
  // isReconnected is true if the user was already connected
  const handleConnect = ({ isReconnected }) => {
    if (!isReconnected && isConnected && shouldOpenModal) {
      openModal({
        modal: "swap" /*props:{onClose={() => dispatch(clearState())}}} */,
      });
    }
  };

  const { isConnected } = useAccount({ onConnect: handleConnect });

  const [strategy, title, subtitle] = useMemo(() => {
    if (!strategyGroup || strategyGroup.length === 0) return [null, null, null];
    const [strategy] = strategyGroup;
    const { name } = strategy;
    const [title, subtitle] = name.replace("Astrolab ", "").split(" ");
    return [strategy, title, subtitle];
  }, [strategyGroup]);

  const strategyIconPath = getIconFromStrategy(strategy).replace(
    ".svg",
    "-mono.svg"
  );
  const openModalStrategy = () => {
    if (strategy === null) return;
    selectStrategy(strategy as Strategy);
    selectStrategyGroup(strategyGroup);
    if (!isConnected) {
      web3Modal.open({ view: "Connect" });
      setShouldOpenModal(true);
    } else
      openModal({
        modal: "swap" /*props:{onClose={() => dispatch(clearState())}}} */,
      });
  };

  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div className="absolute top-0 w-full">
      <div
        className="relative flex flex-col w-full strategy-cta-size max-w-full"
        onClick={openModalStrategy}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 5044 2243"
          fill="none"
        >
          <defs>
            <path
              id="border-path"
              d="M4 150C4 69.3664 69.3664 4 150 4H4894C4974.63 4 5040 69.3664 5040 150V647.011C5040 711.253 4998.01 767.947 4936.55 786.671L192.554 2232.15C98.7492 2260.73 4 2190.55 4 2092.49V150Z"
            />
            <linearGradient id="gradient" x1="0%" y1="100%" x2="200%" y2="0">
              <stop offset="0" stopColor="rgba(255, 255, 255, 0.3)">
                <animate
                  attributeName="offset"
                  values="0;0.8"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </stop>

              <stop offset="0" stopColor="rgba(255, 255, 255, 0.3)">
                <animate
                  attributeName="offset"
                  values="0;0.8"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </stop>

              <stop offset="0.1" stopColor="rgba(255, 255, 255, 0.4)">
                <animate
                  attributeName="offset"
                  values="0.1;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </stop>

              <stop offset="0.1" stopColor="rgba(255, 255, 255, 0.4)">
                <animate
                  attributeName="offset"
                  values="0.1;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
          <clipPath id="clip">
            <use xlinkHref="#border-path" />
          </clipPath>
          <path
            className="cursor-pointer"
            d="M4 150C0 67.1573 67.1573 0 150 0H4894C4976.84 0 5044 67.1573 5044 150V647.011C5044 713.013 5000.86 771.26 4937.72 790.498L193.72 2235.97C97.3451 2265.34 0 2193.24 0 2092.49V150Z"
            fill={
              strategy === null
                ? "url(#gradient)"
                : isHovered
                  ? "rgba(255, 184, 0, 0.1)"
                  : "#1E1E1E"
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          <use
            className="transition-all duration-500 ease-in-out"
            xlinkHref="#border-path"
            stroke={`var(--${isHovered ? "primary" : "secondary"})`}
            strokeWidth={isHovered ? "6px" : "2px"}
          />
          {strategy !== null && (
            <image
              className={clsx("pointer-events-none", {
                "strategy-cta-icon-filter": isHovered,
                "contrast-63": !isHovered,
              })}
              width={"100%"}
              height={"100%"}
              y={"-15%"}
              clipPath="url(#clip)"
              href={strategyIconPath}
            />
          )}
        </svg>
        {strategy !== null && (
          <div className="absolute flex flex-col w-full pointer-events-none">
            <div className="flex flex-row justify-between px-5 pt-5">
              <div
                className={clsx(
                  "me-auto text-2xl md:text-5xl gilroy font-extrabold italic mt-auto",
                  `${isHovered ? "text-primary" : "text-white"}`
                )}
              >
                {title.toUpperCase()}
              </div>
              <StrategyCardIcons
                strategyGroup={strategyGroup}
                hideLabel={true}
                size={{ height: 45, width: 45 }}
              />
            </div>
            <div className="text-2xl md:text-4xl gilroy me-auto text-gray-450 px-5 mb-3">
              {subtitle}
            </div>
            <div className="flex flex-row justify-between px-5">
              <Button className="flex flex-row text-sm text-dark rounded-xl my-auto px-10 pb-1 pt-1.5 font-bold gilroy">
                <StrategyCardAPY
                  hideLabel={true}
                  apy={getRandomAPY(strategy.slug)}
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyCardCTAOne;
