import clsx from "clsx";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { Strategy } from "~/utils/interfaces";

import StrategyCardAPY from "./StrategyCardAPY";
import StrategyCardIcons from "./StrategyCardIcons";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import ActionModal from "../modals/ActionModal";

import "./StrategyCard.css";

import { getStrategyIcon } from "~/utils";
import { getRandomAPY } from "~/utils/mocking";
import { openModal } from "~/services/modal";
import { selectStrategy, selectStrategyGroup } from "~/services/strategies";
import { Button } from "../styled";
import { COLORS } from "~/styles/constants";

interface StrategyProps {
  strategyGroup: Strategy[];
}

const StrategyCardCTATwo = ({ strategyGroup }: StrategyProps) => {
  const web3Modal = useWeb3Modal();
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);

  // handleConnect is called when the user connects to the wallet
  // isReconnected is true if the user was already connected
  const handleConnect = ({ isReconnected }) => {
    if (!isReconnected && isConnected && shouldOpenModal) {
      openModal({
        modal: "swap",
        showTitle: false,
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

  const strategyIconPath = getStrategyIcon(strategy).replace(
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
        modal: "swap",
        showTitle: false,
      });
  };

  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className={clsx("md:-mt-24 absolute w-full bottom-0 right-0 pe-2 z-40")}>
      <div
        className="relative flex flex-col ms-auto pointers-event-none strategy-cta-size max-w-full"
        onClick={openModalStrategy}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 5044 2243"
          fill="none"
        >
          <defs>
            <path
              id="border-path-two"
              d="M5044 2092C5044 2174.84 4976.84 2242 4894 2242L150 2242C67.1572 2242 0 2174.84 0 2092V1595.33C0 1529.32 43.1519 1471.07 106.297 1451.84L4850.3 6.99463C4946.67 -22.3562 5044 49.7458 5044 150.487V2092Z"
              fill="#2E2E2E"
              fillOpacity="0.29"
            />
          </defs>
          <clipPath id="clip-two">
            <use xlinkHref="#border-path-two" />
          </clipPath>
          <use
            xlinkHref="#border-path-two"
            stroke={isHovered ? COLORS.primary : COLORS.secondary}
            strokeWidth={isHovered ? "6px" : "2px"}
          />
          <path
            className="cursor-pointer pointer-events-auto"
            d="M5040 2092C5040 2172.63 4974.63 2238 4894 2238L150 2238C69.3662 2238 4 2172.63 4 2092V1595.33C4 1531.08 46.001 1474.39 107.463 1455.67L4851.46 10.821C4945.26 -17.7471 5040 52.4324 5040 150.487V2092Z"
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
          {strategy !== null && (
            <image
              className={clsx("pointer-events-none", {
                "strategy-cta-icon-filter": isHovered,
                "contrast-63": !isHovered,
              })}
              width={"100%"}
              height={"100%"}
              y={"15%"}
              clipPath="url(#clip-two)"
              href={strategyIconPath}
            />
          )}
        </svg>
        {strategy !== null && (
          <div className="absolute bottom-0 right-0 flex flex-col w-full pointer-events-none">
            <div className="flex flex-col px-5 pb-3">
              <div
                className={clsx(
                  "ms-auto text-2xl md:text-5xl gilroy font-extrabold italic",
                  `${isHovered ? "text-primary" : "text-white"}`
                )}
              >
                {title.toUpperCase()}
              </div>
              <div className="text-2xl md:text-4xl gilroy ms-auto mb-3">
                {subtitle}
              </div>
              <div className="flex flex-row justify-between">
                <StrategyCardIcons
                  strategyGroup={strategyGroup}
                  hideLabel={true}
                  size={{ height: 50, width: 50 }}
                />
                <Button
                  big={true}
                  style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                  className="text-dark my-auto px-10 font-bold italic gilroy"
                >
                  <div
                    className={clsx(
                      "text-4xl font-black group-hover:text-primary"
                    )}
                  >
                    {strategy.apy}
                  </div>
                  <div className="flex flex-col text-center text-xs leading-none -mt-1 -ml-2">
                    <span className="text-2xl font-black">%</span>
                    <span className="font-bold text-xs -mt-2">APY</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyCardCTATwo;
