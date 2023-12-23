import clsx from "clsx";

import { useContext, useState } from "react";
import { SwapMode } from "~/utils/constants";
import { SwapContext } from "~/context/swap-context";

import DepositTab from "~/components/swap/DepositTab";
import Withdraw from "../Withdraw";

const SwapModal = () => {
  return <SwapModalContent />;
};

const SwapModalContent = () => {
  const tabs = {
    deposit: {
      component: <DepositTab />,
    },
    withdraw: {
      component: <Withdraw />,
    },
  };

  const [animationEnter, setAnimationEnter] = useState<'left' | 'right'>(null)
  const [animationLeave, setAnimationLeave] = useState<'left' | 'right'>(null)
  const [selectedTab, setSelectedTab] = useState("deposit");
  const { selectTokenMode, setSwapMode } = useContext(SwapContext);

  function handleTransition(selectedTab: string) {
    const animationKey = selectedTab === "deposit" ? "left" : "right";
    const swapMode = selectedTab === "deposit" ? SwapMode.DEPOSIT : SwapMode.WITHDRAW;
    setAnimationEnter(null);
    setAnimationLeave(animationKey);
    setTimeout(() => {
      setAnimationEnter(animationKey);
      setSelectedTab(selectedTab);
      setSwapMode(swapMode);
      setAnimationLeave(null);
    }, 500);
  }

  return (
    <div className="bg-dark pb-4 pt-6 px-3">
      {!selectTokenMode && (
        <div className="flex flex-row justify-between px-3 ">
          <div
            className={
              clsx("text-3xl cursor-pointer",
              { "font-bold border-white text-primary": selectedTab === "deposit" })
            }
            onClick={() => { handleTransition('deposit') }}
          >
            DEPOSIT
          </div>
          <div className="my-auto">
            or
          </div>
          <div
            className={
              clsx("text-2xl cursor-pointer",
              { "font-bold border-white text-primary": selectedTab === "withdraw" })
            }
            onClick={() => { handleTransition('withdraw') }}
          >
            WITHDRAW
          </div>
        </div>
      )}
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
