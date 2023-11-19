import clsx from "clsx";
import { useState } from "react";
import Deposit from "../Deposit";

const SwapModal = () => {
  const tabs = [
    {
      title: "Deposit",
      component: <Deposit />,
    },
    {
      title: "Withdraw",
      component: <Deposit />,
    },
  ];
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <div role="tablist" className="tabs inline-block">
        {tabs.map(({ title }, index) => (
          <a
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
