import clsx from "clsx";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Transition } from "@headlessui/react";

import { watchAccount } from "wagmi/actions";
import { BaseModalProps } from "../Modal";
import DepositTab from "~/components/swap/DepositTab";
import WithdrawTab from "~/components/swap/WithdrawTab";

import { useInteraction, useIsInit } from "~/hooks/swapper";
import { useBalances, useTokenIsLoaded } from "~/hooks/tokens";
import { useWriteDebounce } from "~/hooks/swapper-actions";
import { useSelectedStrategy } from "~/hooks/strategies";

import { getTokenBySlug } from "~/services/tokens";
import { cacheHash } from "~/utils/format";
import { StrategyInteraction } from "~/utils/constants";

import { EstimationProvider } from "~/context/estimation-context";
import { initSwapper, selectToken, setInteraction } from "~/services/swapper";
import InfoTab from "../swap/InfoTab";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ActionModal = (props: BaseModalProps) => {
  const balances = useBalances();
  const selectedStrategy = useSelectedStrategy();
  const isInit = useIsInit();
  const tokenIsLoaded = useTokenIsLoaded();
  const cleanBalances = useMemo(
    () =>
      balances.filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ amount, amountWei, ...rest }) => rest
      ),
    [balances]
  );

  const [balanceHash, setBalancesHash] = useState(cacheHash(cleanBalances));
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
  }, [balances, accountChanged, cleanBalances, balanceHash]);

  useEffect(() => {
    if (isInit || !tokenIsLoaded) return;
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
  }, [isInit, tokenIsLoaded]);

  return (
    <EstimationProvider>
      <ActionModalContent />
    </EstimationProvider>
  );
};

const ActionModalContent = () => {
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
  const handleTransition = useCallback((selectedTab: string) => {
    const animationKey = selectedTab === "deposit" ? "left" : "right";

    if (selectedTab !== "info") {
      const action =
        selectedTab === "deposit"
          ? StrategyInteraction.DEPOSIT
          : StrategyInteraction.WITHDRAW;
      setInteraction(action);
    }

    setAnimationEnter(null);
    setAnimationLeave(animationKey);
    setTimeout(() => {
      setAnimationEnter(animationKey);

      setAnimationLeave(null);
    }, 500);
  }, []);

  const [isInfo, setIsInfo] = useState(false);
  return (
    <div className="modal-wrapper">
      <div className="flex flex-row justify-between">
        <div
          className={clsx("cursor-pointer text-2xl hover:text-primary", {
            "font-bold border-white text-white text-3xl":
              !isInfo && selectedTab === "deposit",
          })}
          onClick={() => {
            setIsInfo(false);
            handleTransition("deposit");
          }}
        >
          DEPOSIT
        </div>
        <div
          className={clsx("cursor-pointer text-2xl hover:text-primary", {
            "font-bold border-white text-white text-3xl":
              !isInfo && selectedTab === "withdraw",
          })}
          onClick={() => {
            setIsInfo(false);
            handleTransition("withdraw");
          }}
        >
          WITHDRAW
        </div>
        <div
          className={clsx("cursor-pointer text-2xl hover:text-primary", {
            "font-bold border-white text-white text-3xl": isInfo,
          })}
          onClick={() => {
            setIsInfo(true);
            handleTransition("info");
          }}
        >
          INFO
        </div>
      </div>
      <Transition>
        <Transition.Child
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={clsx(
              animationEnter === "left" && "enter-slide-in-left",
              animationEnter === "right" && "enter-slide-in-right",
              animationLeave === "left" && "leave-slide-in-right",
              animationLeave === "right" && "leave-slide-in-left"
            )}
          >
            {!isInfo && tabs[selectedTab].component}
            {isInfo && <InfoTab />}
          </div>
        </Transition.Child>
      </Transition>
    </div>
  );
};
export default ActionModal;
