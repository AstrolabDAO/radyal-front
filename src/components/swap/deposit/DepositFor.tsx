import { useMemo } from "react";

import { getStrategyIcon } from "~/utils";
import { Strategy } from "~/utils/interfaces";

import { useEstimatedRoute } from "~/hooks/swapper";

import ActionBlock from "../helpers/ActionBlock";

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
    background: getStrategyIcon(strategy),
    foreground: strategy?.network?.icon,
  };

  return (
    <ActionBlock
      token={strategy}
      disabled={true}
      label="FOR"
      icons={icons}
      onTokenClick={() => {}}
      symbol={strategy?.symbol}
      network={networkName}
      value={depositToValue}
    >
      <div className="flex ms-auto">
        <input
          className="swap-input-field bg-transparent font-3xl"
          disabled={true}
          value={depositToValue ?? 0}
        />
      </div>
    </ActionBlock>
  );
};

export default DepositFor;
