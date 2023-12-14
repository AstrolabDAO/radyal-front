import clsx from "clsx";
import { useContext, useState } from "react";
import { SwapContext } from "~/context/swap-context";
import Deposit from "../Deposit";
import Withdraw from "../Withdraw";
import { SwapMode } from "~/utils/constants";

const SwapModal = () => {
  return <SwapModalContent />;
};

const SwapModalContent = () => {
  const tabs = {
    deposit: {
      title: "Deposit",
      component: <Deposit />,
      swapMode: SwapMode.DEPOSIT,
    },
    withdraw: {
      title: "Withdraw",
      component: <Withdraw />,
      swapMode: SwapMode.WITHDRAW,
    },
  };
  const [selectedTab, setSelectedTab] = useState("deposit");
  const { selectTokenMode, setSwapMode } = useContext(SwapContext);

  return (
    <div className="p-4">
      {!selectTokenMode && (
        <div role="tablist" className="tabs tabs-bordered inline-block mb-4">
          {Object.entries(tabs)
            .sort(([key]) => (key === selectedTab ? -1 : 0))
            .map(([key, { title, swapMode }]) => (
              <a
                key={key}
                role="tab"
                className={clsx("tab text-xl", {
                  "tab-active": key === selectedTab,
                })}
                onClick={() => {
                  setSelectedTab(key);
                  setSwapMode(swapMode);
                }}
              >
                {title}
              </a>
            ))}
        </div>
      )}
      {tabs[selectedTab].component}
    </div>
  );
};
export default SwapModal;
