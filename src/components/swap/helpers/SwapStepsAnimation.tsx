import Lottie from "lottie-react";

import BridgeAnimation from "~/assets/animations/bridge.json";
import DepositAnimation from "~/assets/animations/deposit.json";
import SwapAnimation from "~/assets/animations/swap.json";
import WithdrawAnimation from "~/assets/animations/withdraw.json";

type SelectTokenAnimationProps = {
  mode: "bridge" | "deposit" | "swap" | "withdraw";
  className?: string;
};

const SelectTokenAnimation = ({ mode, className }: SelectTokenAnimationProps) => {
  const animation = {
    bridge: BridgeAnimation,
    deposit: DepositAnimation,
    swap: SwapAnimation,
    withdraw: WithdrawAnimation,
  }[mode];

  return (
    <Lottie
      animationData={animation}
      loop={true}
      className={className}
    />
  );
}

export default SelectTokenAnimation;