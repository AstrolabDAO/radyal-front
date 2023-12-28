import clsx from "clsx";

import { useContext, useState } from "react";

import { SwapMode } from "~/utils/constants";
import { SwapContext } from "~/context/swap-context";

import DepositTab from "../swap/DepositTab";
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
  const [selectedTab, setSelectedTab] = useState("deposit");
  const { selectTokenMode, setSwapMode } = useContext(SwapContext);

  return (
    <div className="bg-dark px-6 pt-6">
      {!selectTokenMode && (
        <div className="flex flex-row justify-between px-3">
          <div
            className={
              clsx("text-2xl cursor-pointer",
              { "font-bold border-white border-b border-solid	": selectedTab === "deposit" })
            }
            onClick={() => {
              setSelectedTab('deposit');
              setSwapMode(SwapMode.DEPOSIT);
            }}
          >
            DEPOSIT
          </div>
          <div>
            or
          </div>
          <div
            className={
              clsx("text-2xl cursor-pointer",
              { "font-bold border-white border-b border-solid	": selectedTab === "withdraw" })
            }
            onClick={() => {
              setSelectedTab('withdraw');
              setSwapMode(SwapMode.WITHDRAW);
            }}
          >
            WITHDRAW
          </div>
        </div>
      )}
      { tabs[selectedTab].component }
    </div>
  );
};
export default SwapModal;
