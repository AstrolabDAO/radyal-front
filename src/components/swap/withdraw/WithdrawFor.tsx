import { useMemo } from "react";

import { useCanSwap, useEstimatedRoute } from "~/hooks/store/swapper";
import { Token } from "~/utils/interfaces";
import SwapBlock from "../helpers/SwapBlock";

type WForProps = {
  token: Token;
  onTokenClick: () => void;
};

const WithdrawFor = ({ token, onTokenClick }: WForProps) => {
  const estimate = useEstimatedRoute();
  const depositToValue = useMemo(() => {
    return estimate?.estimation;
  }, [estimate]);
  const canSwap = useCanSwap();
  const icons = {
    background: `${token?.icon}`,
    foreground: token?.network?.icon,
  };

  return (
    <SwapBlock
      token={token}
      disabled={!canSwap}
      label="FOR"
      icons={icons}
      onTokenClick={onTokenClick}
      symbol={token?.symbol}
      network={token?.network.name}
      value={depositToValue}
      children={
        <div className="text-xl font-bold mt-2 mb-1"> {depositToValue} </div>
      }
    />
  );
};

export default WithdrawFor;
