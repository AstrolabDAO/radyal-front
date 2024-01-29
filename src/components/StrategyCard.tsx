import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Strategy } from "~/utils/interfaces";
import StrategyData from "./StrategyData";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SwapModalContext } from "~/context/swap-modal-context";
import {
  useSelectStrategy,
  useSelectedStrategy,
} from "~/hooks/store/strategies";
import IconCard from "./IconCard";
import SwapModal from "./modals/SwapModal";

interface StrategyProps {
  strategyGroup: Strategy[];
}
const StrategyCard = ({ strategyGroup }: StrategyProps) => {
  const strategy = strategyGroup[0];

  const { name } = strategy;
  const selectStrategy = useSelectStrategy();
  const selectedStrategy = useSelectedStrategy();

  const { openModal } = useContext(SwapModalContext);

  const [connectionAsked, setConnectionAsked] = useState(false);
  const { isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  useEffect(() => {
    if (isConnected && connectionAsked) {
      openModal(<SwapModal />);
      setConnectionAsked(false);
    }
  }, [connectionAsked, isConnected, openModal]);
  return (
    <li
      className={clsx(
        "card bg-base-100 shadow-xl p-2 cursor-pointer transition-500 active-bordered active-shadow bg-dark",
        { active: selectedStrategy?.slug === strategy.slug }
      )}
      onClick={async () => {
        selectStrategy(strategy);
        if (!isConnected) {
          await web3Modal.open({ view: "Connect" });
          setConnectionAsked(true);
        } else openModal(<SwapModal />);
      }}
    >
      <div>
        <h2 className="card-title">
          {name}
          <div className="flex w-full justify-end items-center">
            <span className="mr-4">ON</span>
            <ul
              className={clsx(
                "flex border border-solid border-secondary-500 rounded-3xl items-center"
              )}
            >
              {strategyGroup.map((strategy) => {
                return (
                  <li
                    key={strategy.network.id}
                    className="flex items-center p-2"
                  >
                    <IconCard
                      icon={{
                        url: strategy.network.icon,
                        alt: strategy.network.name,
                        size: { width: 28, height: 28 },
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </h2>
        <ul className="infos flex mt-6">
          <StrategyData label="APR" data="12.31%" />
          <StrategyData label="Positions" data="0.00$" />
        </ul>
      </div>
    </li>
  );
};

export default StrategyCard;
