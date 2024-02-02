import clsx from "clsx";

import { useEffect, useMemo, useState } from "react";
import { Transition } from "@headlessui/react";


import { watchAccount } from "wagmi/actions";
import { BaseModalProps } from "../Modal";
import DepositTab from "~/components/swap/DepositTab";
import WithdrawTab from "~/components/swap/WithdrawTab";

import {
  useInitSwapper,
  useInteraction,
  useIsInit,
  useSelectToken,
  useSetInteraction,
} from "~/hooks/store/swapper";
import { useBalances } from "~/hooks/store/tokens";
import { useWriteDebounce } from "~/hooks/swapper-actions";
import { useSelectedStrategy } from "~/hooks/store/strategies";

import { getTokenBySlug } from "~/services/tokens";
import { cacheHash } from "~/utils/format";
import { StrategyInteraction } from "~/utils/constants";

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
    <div className="modal-wrapper">
      <div className="flex flex-row justify-around items-center">
        <div
          className={
            clsx("cursor-pointer text-2xl",
            { "font-bold border-white text-primary text-3xl": selectedTab === "deposit" })
          }
          onClick={() => { handleTransition('deposit') }}
        >
          DEPOSIT
        </div>
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
            className={
              clsx(
                animationEnter === 'left' && 'enter-slide-in-left',
                animationEnter === 'right' && 'enter-slide-in-right',
                animationLeave === 'left' && 'leave-slide-in-right',
                animationLeave === 'right' && 'leave-slide-in-left',
              )
            }>
              { tabs[selectedTab].component }
          </div>
          </Transition.Child>
      </Transition>
    </div>
  );
};
export default SwapModal;
