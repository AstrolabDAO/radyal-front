import { useMemo } from "react";

import { getIconFromStrategy } from "~/utils";
import { Strategy } from "~/utils/interfaces";

import { useEstimatedRoute } from "~/hooks/store/swapper";

import SwapBlock from "../helpers/SwapBlock";


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

  const icons = {
    background: getIconFromStrategy(strategy),
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
