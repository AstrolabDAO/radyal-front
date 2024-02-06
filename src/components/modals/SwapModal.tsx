import clsx from "clsx";

import { useEffect, useMemo, useState } from "react";

import { StrategyInteraction } from "~/utils/constants";

import { watchAccount } from "wagmi/actions";
import DepositTab from "~/components/swap/DepositTab";
import WithdrawTab from "~/components/swap/WithdrawTab";
import { useSelectedStrategy } from "~/hooks/store/strategies";
import {
  useInitSwapper,
  useInteraction,
  useIsInit,
  useSelectToken,
  useSetInteraction,
} from "~/hooks/store/swapper";
import { useBalances } from "~/hooks/store/tokens";
import { useWriteDebounce } from "~/hooks/swapper-actions";
import { getTokenBySlug } from "~/services/tokens";
import { cacheHash } from "~/utils/format";
import { BaseModalProps } from "../Modal";
import { EstimationProvider } from "~/context/estimation-context";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SwapModal = (props: BaseModalProps) => {
  const initSwapper = useInitSwapper();
  const balances = useBalances();
  const selectedStrategy = useSelectedStrategy();
  const isInit = useIsInit();

  const cleanBalances = useMemo(
    () =>
      balances.filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ amount, amountWei, ...rest }) => rest
      ),
    [balances]
  );

  const [balanceHash, setBalancesHash] = useState(cacheHash(cleanBalances));
  const selectToken = useSelectToken();
  const [accountChanged, setAccountChanged] = useState(false);
  const firstBalance = useMemo(() => {
    return balances[0] ?? null;
  }, [balances]);

  useWriteDebounce();

  useEffect(() => {
    watchAccount(() => {
      setAccountChanged(true);
    });
  }, []);

  useEffect(() => {
    const newHash = cacheHash(cleanBalances);
    if (accountChanged && balanceHash !== newHash) {
      const token = getTokenBySlug(balances?.[0]?.token) ?? null;
      selectToken({
        token,
        interaction: StrategyInteraction.DEPOSIT,
        for: "from",
      });
      setBalancesHash(newHash);
      setAccountChanged(false);
    }
  }, [balances, accountChanged, cleanBalances, balanceHash, selectToken]);

  useEffect(() => {
    if (isInit) return;

    initSwapper({
      deposit: {
        from: getTokenBySlug(firstBalance?.token) ?? null,
        to: selectedStrategy,
        value: 0,
        estimatedRoute: null,
      },
      withdraw: {
        from: selectedStrategy,
        to: selectedStrategy.asset,
        value: 0,
        estimatedRoute: null,
      },
      interaction: StrategyInteraction.DEPOSIT,
    });
  });

  return (
    <EstimationProvider>
      <SwapModalContent />
    </EstimationProvider>
  );
};

const SwapModalContent = () => {
  const setInteraction = useSetInteraction();
  const tabs = {
    deposit: {
      component: <DepositTab />,
    },
    withdraw: {
      component: <WithdrawTab />,
    },
  };

  const [animationEnter, setAnimationEnter] = useState<"left" | "right">(null);
  const [animationLeave, setAnimationLeave] = useState<"left" | "right">(null);

  const selectedTab = useInteraction();
  function handleTransition(selectedTab: string) {
    const animationKey = selectedTab === "deposit" ? "left" : "right";
    const action =
      selectedTab === "deposit"
        ? StrategyInteraction.DEPOSIT
        : StrategyInteraction.WITHDRAW;
    setAnimationEnter(null);
    setAnimationLeave(animationKey);
    setTimeout(() => {
      setAnimationEnter(animationKey);

      setInteraction(action);
      setAnimationLeave(null);
    }, 500);
  }

  return (
    <div className="bg-dark-800 pb-4 pt-6 px-3 max-h-screen sm-max-h-95vh">
      <div className="flex flex-row justify-between px-3">
        <div
          className={clsx("text-2xl cursor-pointer", {
            "font-bold border-white text-primary text-3xl":
              selectedTab === "deposit",
          })}
          onClick={() => {
            handleTransition("deposit");
          }}
        >
          DEPOSIT
        </div>
        <div className="my-auto text-gray-500">OR</div>
        <div
          className={clsx("cursor-pointer text-2xl", {
            "font-bold border-white text-primary text-3xl":
              selectedTab === "withdraw",
          })}
          onClick={() => {
            handleTransition("withdraw");
          }}
        >
          WITHDRAW
        </div>
      </div>
      <div
        key={selectedTab}
        className={clsx("overflow-x-hidden", {
          "enter-slide-in-left": animationEnter === "left",
          "enter-slide-in-right": animationEnter === "right",
          "leave-slide-in-right": animationLeave === "left",
          "leave-slide-in-left": animationLeave === "right",
        })}
      >
        {tabs[selectedTab].component}
      </div>
    </div>
  );
};
export default SwapModal;
