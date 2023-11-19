import { Strategy } from "~/utils/interfaces";
import IconGroup from "./IconGroup";
import StrategyData from "./StrategyData";
import { useContext } from "react";
import { StrategyContext } from "~/context/strategy-context";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { web3Modal } from "~/main";
import { ModalContext } from "~/context/modal-context";
import SwapModal from "./modals/SwapModal";

interface StrategyProps {
  strategy: Strategy;
}
const StrategyBox = ({ strategy }: StrategyProps) => {
  const { name } = strategy;
  const { nativeNetwork, token } = strategy;
  const { selectStrategy, selectedStrategy } = useContext(StrategyContext);
  const { open } = useContext(ModalContext);
  const { isConnected } = useAccount();

  const icons = [
    {
      url: nativeNetwork.icon,
      alt: nativeNetwork.name,
      classes: "border-primary",
    },
    {
      url: token.icon,
      alt: token.symbol,
      small: true,
      classes: "border-primary",
    },
  ];
  return (
    <div className="p-2 w-full md:w-1/2 xl:w-1/3">
      <div
        className={clsx(
          "card bg-base-100 shadow-xl w-full p-2 cursor-pointer transition-500 active-bordered active-shadow",
          { active: selectedStrategy?.slug === strategy.slug }
        )}
        onClick={() => {
          selectStrategy(strategy);
          if (!isConnected) web3Modal.open().then(() => open(<SwapModal />));
          else open(<SwapModal />);
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
    </div>
  );
};
export default StrategyBox;
