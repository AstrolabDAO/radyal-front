import { useMemo } from "react";

import { useEstimatedRoute } from "~/hooks/swapper";
import { Token } from "~/utils/interfaces";
import ActionBlock from "../helpers/ActionBlock";
import { SwapInput } from "~/components/styled";

type WForProps = {
  token: Token;
  onTokenClick: () => void;
};

const WithdrawFor = ({ token, onTokenClick }: WForProps) => {
  const estimate = useEstimatedRoute();
  const depositToValue = useMemo(() => {
    return estimate?.estimation;
  }, [estimate]);

  const icons = {
    background: token?.icon,
    foreground: token?.network?.icon,
  };

  return (
    <ActionBlock
      token={token}
      label="FOR"
      icons={icons}
      onTokenClick={onTokenClick}
      symbol={token?.symbol}
      network={token?.network.name}
      value={depositToValue}
    >
      <div className="flex ms-auto">
        <SwapInput disabled={true} value={depositToValue ?? 0} />
      </div>
    </ActionBlock>
  );
};

export default WithdrawFor;
