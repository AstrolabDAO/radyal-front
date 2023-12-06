import clsx from "clsx";
import { useContext, useState } from "react";
import { SwapContext } from "~/context/swap-context";
import Deposit from "../Deposit";
import Withdraw from "../Withdraw";

const SwapModal = () => {
  return <SwapModalContent />;
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
  const { selectTokenMode } = useContext(SwapContext);

  return (
    <div className="bg-white p-4">
      <>
        {!selectTokenMode && (
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
        )}
        {tabs[selectedTab].component}
      </>
    </div>
  );
};
export default SwapModal;
