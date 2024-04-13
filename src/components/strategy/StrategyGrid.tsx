import { useDispatch } from "react-redux";

import {
  useGrouppedStrategies,
  useStrategiesNetworks,
} from "~/hooks/strategies";
import { filterByNetworks, search } from "~/store/strategies";

import NetworkSelect, { NetworkSelectData } from "../NetworkSelect";
import StrategyCard from "./StrategyCard";
import StrategyTable from "./table/StrategyTable";

import CardIcon from "@/assets/icons/card-view.svg?react";
import TableIcon from "@/assets/icons/table-view.svg?react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { StrategyTableContextProvider } from "~/context/strategy-table.context";
import { Input } from "../styled";

const StrategyGrid = () => {
  const [tabActive, setTabActive] = useState<"cards" | "table">("cards");
  const [animationEnter, setAnimationEnter] = useState<"left" | "right">(null);
  const [animationLeave, setAnimationLeave] = useState<"left" | "right">(null);

  const handleTransition = useCallback(
    (selectedTab: string) => {
      if (selectedTab === tabActive) {
        return;
      }
      const animationKey = selectedTab === "cards" ? "left" : "right";
      setAnimationEnter(null);
      setAnimationLeave(animationKey);
      setTimeout(() => {
        setAnimationEnter(animationKey);
        setTabActive(selectedTab as "cards" | "table");
        setAnimationLeave(null);
      }, 500);
    },
    [tabActive]
  );
  const grouppedStrategies = useGrouppedStrategies();
  const dispatch = useDispatch();
  const strategiesNetworks = useStrategiesNetworks();

  return (
    <div className="w-full container px-2 sm:mx-auto mt-5 overflow-x-hidden">
      <div className="flex flex-row ms-auto w-full justify-end gap-x-3 items-center">
        <div className="flex w-10 h-10">
          <CardIcon
            className={clsx(
              tabActive === "cards" ? "fill-primary" : "fill-dark-500",
              "cursor-pointer hover:fill-primary/50"
            )}
            onClick={() => {
              handleTransition("cards");
            }}
          />
        </div>
        <div className="flex w-10 h-10">
          <TableIcon
            className={clsx(
              tabActive === "table" ? "fill-primary" : "fill-dark-500",
              "cursor-pointer hover:fill-primary/50"
            )}
            onClick={() => {
              handleTransition("table");
            }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full relative z-30">
        <div className="mr-4 w-full flex flex-col">
          <span className="label-text block mb-1">Search a strategy</span>
          <Input
            type="text"
            className="bordered-hover"
            placeholder="“Stable”, “Arbitrum”, “Staking”..."
            onChange={({ target }) => {
              dispatch(search(target.value));
            }}
          />
        </div>
        <div className="flex flex-col relative my-4 md:my-auto">
          <span className="label-text mb-1">Chain</span>
          <NetworkSelect
            isSearchable={false}
            className="w-full md:w-64 h-12"
            networks={strategiesNetworks}
            onChange={(value: Array<NetworkSelectData>) => {
              dispatch(filterByNetworks(value.map((v) => v.network?.slug)));
            }}
          />
        </div>
      </div>
      {grouppedStrategies.length === 0 && (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5 max-w-screen">
          <div className="card shimmer h-36" />
          <div className="card shimmer h-36" />
          <div className="card shimmer h-36" />
          <div className="card shimmer h-36" />
          <div className="card shimmer h-36" />
          <div className="card shimmer h-36" />
        </div>
      )}
      <div className="my-5 relative">
        <Transition show={true}>
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
              {tabActive === "cards" && (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-screen">
                  {grouppedStrategies.map((strategyGroup, index) => (
                    <StrategyCard
                      strategyGroup={strategyGroup}
                      key={`strategy-group-${index}`}
                    />
                  ))}
                </div>
              )}
              {tabActive === "table" && (
                <StrategyTableContextProvider>
                  <StrategyTable />
                </StrategyTableContextProvider>
              )}
            </div>
          </Transition.Child>
        </Transition>
      </div>
    </div>
  );
};

export default StrategyGrid;
