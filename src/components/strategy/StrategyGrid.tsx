import { useDispatch, useSelector } from "react-redux";
import { useOpenModal } from "~/hooks/store/modal";
import { useSelectOperation } from "~/hooks/store/operation";
import {
  useGrouppedStrategies,
  useStrategiesNetworks,
} from "~/hooks/store/strategies";
import { operationsSelector } from "~/store/selectors/operations";
import { filterByNetworks, search } from "~/store/strategies";

import NetworkSelect, { NetworkSelectData } from "../NetworkSelect";
import SwapStepsModal from "../modals/SwapStepsModal";
import StrategyCard from "./StrategyCard";
import StrategyTable from "./table/StrategyTable";

import CardIcon from '@/assets/icons/cards.svg?react';
import TableIcon from '@/assets/icons/table.svg?react';
import { useCallback, useState } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";

const StrategyGrid = () => {
  const [tabActive, setTabActive] = useState<"cards" | "table">('cards');
  const [animationEnter, setAnimationEnter] = useState<"left" | "right">(null);
  const [animationLeave, setAnimationLeave] = useState<"left" | "right">(null);

  const handleTransition = useCallback((selectedTab: string) => {
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
  }, [tabActive]);
  const grouppedStrategies = useGrouppedStrategies();
  const operations = useSelector(operationsSelector);
  const dispatch = useDispatch();
  const selectOperation = useSelectOperation();
  const strategiesNetworks = useStrategiesNetworks();
  const openModal = useOpenModal();

  return (
    <div className="w-full container px-2 sm:mx-auto mt-5 overflow-x-hidden">
      <div className="flex flex-row ms-auto w-full justify-end gap-x-3 items-center">
        <div className="flex w-8 h-8">
          <TableIcon
            className={ clsx(tabActive === 'cards' ? "fill-primary" : "fill-dark-500",
            "cursor-pointer hover:fill-primary/50") }
            onClick={() => { handleTransition('cards') }}
          />
        </div>
        <div className="flex w-8 h-8">
          <CardIcon
            className={ clsx(tabActive === 'table' ? "fill-primary" : "fill-dark-500",
            "cursor-pointer hover:fill-primary/50") }
            onClick={() => { handleTransition('table') }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="mr-4 w-full flex flex-col">
          <span className="label-text block my-2">Search</span>
          <input
            type="text"
            placeholder="“Stable”, “Arbitrum”, “Staking”..."
            className="input input-bordered hover:border-primary w-full focus:outline-none bg-dark-800/25 backdrop-blur-3"
            onChange={({ target }) => {
              dispatch(search(target.value));
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="label-text my-2">Chain</span>
          <NetworkSelect
            isSearchable={false}
            className="w-64 h-12 bg-dark-800/25 backdrop-blur-3"
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
      <div className="my-5">
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
              className={
                clsx(
                  animationEnter === 'left' && 'enter-slide-in-left',
                  animationEnter === 'right' && 'enter-slide-in-right',
                  animationLeave === 'left' && 'leave-slide-in-right',
                  animationLeave === 'right' && 'leave-slide-in-left',
                )
              }>
                { tabActive === 'cards' && (
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-screen">
                    {grouppedStrategies.map((strategyGroup, index) => (
                      <StrategyCard
                        strategyGroup={strategyGroup}
                        key={`strategy-group-${index}`}
                      />
                    ))}
                  </div>
                )}
                { tabActive === 'table' &&
                  <StrategyTable
                    strategies={grouppedStrategies}
                  />
                }
            </div>
          </Transition.Child>
        </Transition>
      </div>
      <ul className="transactionList">
        {operations.map((operation) => (
          <li key={operation.id}>
            <button
              onClick={() => {
                selectOperation(operation.id);
                openModal(<SwapStepsModal />);
              }}
            >
              {operation.id} {"=>"} {operation.status} {" => "}{" "}
              {operation.substatus}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StrategyGrid;
