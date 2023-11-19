import clsx from "clsx";
import { useState } from "react";
import Deposit from "../Deposit";
import Withdraw from "../Withdraw";

const SwapModal = () => {
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
  console.log(
    "🚀 ~ file: SwapModal.tsx:18 ~ SwapModal ~ selectedTab:",
    selectedTab,
    tabs[selectedTab]
  );

  return (
    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <div role="tablist" className="tabs inline-block">
        {tabs.map(({ title }, index) => (
          <a
            key={title}
            role="tab"
            className={clsx("tab", {
              active: selectedTab === index,
              "text-primary": selectedTab === index,
            })}
            onClick={() => setSelectedTab(index)}
          >
            {title}
          </a>
        ))}
      </div>
      {tabs[selectedTab].component}
    </div>
  );
};
export default SwapModal;
