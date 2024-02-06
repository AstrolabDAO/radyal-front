import { useContext, useMemo } from "react";

import { Strategy } from "~/utils/interfaces";

import SwapBlock from "../helpers/SwapBlock";

import { getIconFromStrategy } from "~/utils";
import { Web3Context } from "~/context/web3-context";
import { useEstimatedRoute } from "~/hooks/store/swapper";

const DepositFor = ({
  strategy,
}: {
  strategy: Strategy & { protocols?: any[] };
}) => {
  const depositToValue = useEstimatedRoute()?.estimation;
  const networkName = useMemo(() => {
    if (strategy?.network.name === "Gnosis Chain-Mainnet") return "Gnosis";
    return strategy?.network.name;
  }, [strategy]);

  const protocols = useContext(Web3Context)?.protocols;

  const background = getIconFromStrategy(strategy, protocols);

  const icons = {
    background,
    foreground: strategy?.network?.icon,
  };

  return (
    <SwapBlock
      token={strategy}
      disabled={true}
      label="FOR"
      icons={icons}
      onTokenClick={() => {}}
      symbol={strategy?.symbol}
      network={networkName}
      value={depositToValue}
      children={
        <div className="text-xl font-medium text-secondary caret-primary">
          {" "}
          {depositToValue ?? 0}{" "}
        </div>
      }
    />
  );
};

export default DepositFor;
