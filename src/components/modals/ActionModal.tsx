import clsx from "clsx";

import { Transition } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { watchAccount } from "wagmi/actions";
import DepositTab from "~/components/swap/DepositTab";
import WithdrawTab from "~/components/swap/WithdrawTab";

import Close from "~/assets/icons/close.svg?react";

import { useInteraction, useIsInit } from "~/hooks/swapper";
import { useBalances, useTokenIsLoaded } from "~/hooks/tokens";

import { useSelectedStrategy } from "~/hooks/strategies";

import { getTokenBySlug } from "~/services/tokens";
import { cacheHash } from "~/utils/format";

import { EstimationProvider } from "~/context/estimation-context";
import { closeModal } from "~/services/modal";
import { initSwapper, selectToken, setInteraction } from "~/services/swapper";
import { getWagmiConfig } from "~/services/web3";
import { ActionInteraction } from "~/store/swapper";
import InfoTab from "../swap/InfoTab";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ActionModal = () => {
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

  useEffect(() => {
    watchAccount(getWagmiConfig(), {
      onChange: () => {
        setAccountChanged(true);
      },
    });
  }, []);

  useEffect(() => {
    const newHash = cacheHash(cleanBalances);
    if (accountChanged && balanceHash !== newHash) {
      const token = getTokenBySlug(balances?.[0]?.token) ?? null;
      selectToken({
        token,
        interaction: ActionInteraction.DEPOSIT,
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
      interaction: ActionInteraction.DEPOSIT,
    });
  }, [isInit, tokenIsLoaded]);

  return (
    <>
      <EstimationProvider>
        <ActionModalContent />
      </EstimationProvider>
    </>
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
          ? ActionInteraction.DEPOSIT
          : ActionInteraction.WITHDRAW;
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
    <>
      <div className="flex mb-8">
        <div className="flex justify-between w-full uppercase text-xl md:text-2-5xl items-center">
          <div
            className={clsx("cursor-pointer hover:text-primary", {
              "font-bold border-white text-white text-xl md:text-3xl":
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
            className={clsx("cursor-pointer  hover:text-primary", {
              "font-bold border-white text-white text-xl md:text-3xl":
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
            className={clsx("cursor-pointer  hover:text-primary mr-4", {
              "font-bold border-white text-white  text-xl md:text-3xl": isInfo,
            })}
            onClick={() => {
              setIsInfo(true);
              handleTransition("info");
            }}
          >
            INFO
          </div>
        </div>
        <div
          className="z-30 rounded-tr-xl text-white my-auto"
          onClick={closeModal}
        >
          <Close className="h-6 fill-base-content hover:fill-primary" />
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
    </>
  );
};
export default ActionModal;
