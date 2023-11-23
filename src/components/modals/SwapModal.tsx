import clsx from "clsx";
import { useContext, useState } from "react";
import Deposit from "../Deposit";
import Withdraw from "../Withdraw";
import {
  SwapModalContext,
  SwapModalProvider,
} from "~/context/swap-modal-context";
import SelectToken from "../SelectToken";

const SwapModal = () => {
  return (
    <SwapModalProvider>
      <SwapModalContent />
    </SwapModalProvider>
  );
};

const SwapModalContent = () => {
  const tabs = [
    {
      title: "Deposit",
      component: <Deposit />,
    },
    {
      title: "Withdraw",
      component: <Withdraw />,
    },
  ];
  const [selectedTab, setSelectedTab] = useState(0);
  const { selectTokenMode, sortedTokens, switchSelectMode } =
    useContext(SwapModalContext);
  return (
    <div className="bg-white p-4">
      {selectTokenMode && <SelectToken />}
      {!selectTokenMode && (
        <>
          <div role="tablist" className="tabs tabs-bordered inline-block mb-4">
            {tabs.map(({ title }, index) => (
              <a
                key={title}
                role="tab"
                className={clsx("tab", {
                  "tab-active": selectedTab === index,
                })}
                onClick={() => setSelectedTab(index)}
              >
                {title}
              </a>
            ))}
          </div>
          {tabs[selectedTab].component}
        </>
      )}
    </div>
  );
};
export default SwapModal;
