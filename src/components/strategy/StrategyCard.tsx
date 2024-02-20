import clsx from "clsx";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useAccount, useAccountEffect } from "wagmi";

import { getStrategyIcon } from "~/utils";
import { Strategy } from "~/utils/interfaces";

import { useWeb3Modal } from "@web3modal/wagmi/react";

import { useSelectedStrategy } from "~/hooks/strategies";

import StrategyCardAPY from "./StrategyCardAPY";
import StrategyCardIcons from "./StrategyCardIcons";
import StrategyCardTVL from "./StrategyCardTVL";

import { openModal } from "~/services/modal";
import { selectStrategy, selectStrategyGroup } from "~/services/strategies";
import "./StrategyCard.css";
import { WAGMI_CONFIG } from "~/utils/setup-web3modal";

interface StrategyProps {
  strategyGroup: Strategy[];
}
const StrategyCard = ({ strategyGroup }: StrategyProps) => {
  const web3Modal = useWeb3Modal();
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);

  const dispatch = useDispatch();
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

  const { isConnected } = useAccount(WAGMI_CONFIG as any);
  useAccountEffect({
    onConnect(data) { handleConnect(data) },
    onDisconnect() {},
  })
  const [strategy] = strategyGroup;

  const { name } = strategy;
  const [title, ...subtitle] = name
    .replace(/\b(Astrolab |v2|v3)\b/g, "")
    .split(" ");

  const selectedStrategy = useSelectedStrategy();

  const openModalStrategy = () => {
    selectStrategy(strategy);
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

  const strategyIconPath = getStrategyIcon(strategy).replace(
    ".svg",
    "-mono.svg"
  );
  const assetIconPath = useMemo(() => {
    return (
      strategy.asset.icon.substring(0, strategy.asset.icon.length - 4) +
      "-mono.svg"
    );
  }, [strategy]);

  return (
    <div
      className={clsx("card group strategy-card", {
        active: selectedStrategy?.slug === strategy.slug,
      })}
      onClick={openModalStrategy}
    >
      <div className="absolute inset-0 flex top-7 left-5 z-0 contrast-63 group-hover:contrast-100">
        <img src={assetIconPath} className="h-20 w-20 strategy-icon-filter" />
      </div>
      <div className="absolute rounded-3xl inset-0 flex items-center justify-end z-0 overflow-hidden contrast-63 group-hover:contrast-100">
        <img
          src={strategyIconPath}
          className="h-52 w-52 -mr-16 strategy-icon-filter"
        />
      </div>
      <div className="card-body py-4 px-5 z-10">
        <div className="flex flex-row w-full">
          <div className="flex flex-col m-0 p-0 gilroy w-full">
            <div className="flex flex-row">
              <div className="font-extrabold italic uppercase text-4xl -mb-1 group-hover:text-primary me-auto text-white">
                {title}
              </div>
              <StrategyCardIcons strategyGroup={strategyGroup} />
            </div>
            <div className="flex font-light my-auto text-2xl">
              {subtitle.join(" ")}
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-auto">
          <StrategyCardAPY apy={strategy.apy} />
          <StrategyCardTVL tvl={strategy.tvl} />
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
