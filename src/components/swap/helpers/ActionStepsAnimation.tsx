import Lottie from "lottie-react";
import { useMemo } from "react";
import { custom } from "viem";

import BridgeAnimation from "~/assets/animations/bridge.json";
import DepositAnimation from "~/assets/animations/deposit.json";
import SwapAnimation from "~/assets/animations/swap.json";
import WithdrawAnimation from "~/assets/animations/withdraw.json";

type SelectTokenAnimationProps = {
  mode: "cross" | "bridge" | "deposit" | "swap" | "withdraw";
  className?: string;
};

const animations = {
  bridge: BridgeAnimation,
  cross: BridgeAnimation,
  deposit: DepositAnimation,
  custom: DepositAnimation,
  swap: SwapAnimation,
  withdraw: WithdrawAnimation,
};

enum Actiontitle {
  BRIDGE = "Bridging",
  DEPOSIT = "Depositing",
  WITHDRAW = "Withdrawing",
  SWAP = "Swapping",
}
const animationTitle = {
  bridge: Actiontitle.BRIDGE,
  cross: Actiontitle.BRIDGE,
  deposit: Actiontitle.DEPOSIT,
  custom: Actiontitle.DEPOSIT,
  swap: Actiontitle.SWAP,
  withdraw: Actiontitle.WITHDRAW,
};
const SelectTokenAnimation = ({
  mode,
  className,
}: SelectTokenAnimationProps) => {
  const animation = useMemo(() => animations[mode], [mode]);
  const title = useMemo(() => animationTitle[mode], [mode]);
  if (!animation) return null;
  return (
    <>
      <Lottie animationData={animation} loop={true} className={className} />
      <span className="text-center text-white text-sm -mt-8 uppercase">
        {title}
      </span>
    </>
  );
};

export default SelectTokenAnimation;
