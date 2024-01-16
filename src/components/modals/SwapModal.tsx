import clsx from "clsx";

import { useContext, useState } from "react";
import { SwapContext } from "~/context/swap-context";

import { StrategyInteraction } from "~/utils/constants";

import DepositTab from "~/components/swap/DepositTab";
import WithdrawTab from "~/components/swap/WithdrawTab";

const SwapModal = () => {
  return <SwapModalContent />;
};

const SwapModalContent = () => {

  const { setAction } = useContext(SwapContext);

  const tabs = {
    deposit: {
      component: <DepositTab />,
    },
    withdraw: {
      component: <WithdrawTab />,
    },
  };

  const [animationEnter, setAnimationEnter] = useState<'left' | 'right'>(null)
  const [animationLeave, setAnimationLeave] = useState<'left' | 'right'>(null)
  const [selectedTab, setSelectedTab] = useState("deposit");

  function handleTransition(selectedTab: string) {
    const animationKey = selectedTab === "deposit" ? "left" : "right";
    const action = selectedTab === "deposit" ? StrategyInteraction.DEPOSIT : StrategyInteraction.WITHDRAW;
    setAnimationEnter(null);
    setAnimationLeave(animationKey);
    setTimeout(() => {
      setAnimationEnter(animationKey);
      setSelectedTab(selectedTab);
      setAction(action);
      setAnimationLeave(null);
    }, 500);
  }

  return (
    <div className="bg-dark pb-4 pt-6 px-3 max-h-screen">
      <div className="flex flex-row justify-between px-3 ">
        <div
          className={
            clsx("text-3xl cursor-pointer mx-auto",
            { "font-bold border-white text-primary": selectedTab === "deposit" })
          }
          onClick={() => { handleTransition('deposit') }}
        >
          DEPOSIT
        </div>
        <div className="my-auto">
          |
        </div>
        <div
          className={
            clsx("text-2xl cursor-pointer mx-auto",
            { "font-bold border-white text-primary": selectedTab === "withdraw" })
          }
          onClick={() => { handleTransition('withdraw') }}
        >
          WITHDRAW
        </div>
      </div>
      <div
        key={ selectedTab }
        className={
          clsx("overflow-x-hidden", {
            'enter-slide-in-left': animationEnter === 'left',
            'enter-slide-in-right': animationEnter === 'right',
            'leave-slide-in-right': animationLeave === 'left',
            'leave-slide-in-left': animationLeave === 'right',
          })
        }>
        { tabs[selectedTab].component }
      </div>
    </div>
  );
};
export default SwapModal;
