import { useState } from "react";

import { WalletIcon } from '@heroicons/react/24/solid';

import { Strategy } from "~/utils/interfaces";
import IconGroup from "~/components/IconGroup";


type DepositWithProps = {
  strategy: Strategy;
  onTokenClick: () => void;
}

const DepositWith = ({ strategy, onTokenClick } : DepositWithProps) => {
  const balance = 245000000;
  const dollarEquivalent = 0;

  const [number, setNumber] = useState('');
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setNumber(newValue);
  };

  const icons = [
    { url: strategy.asset.icon, alt: strategy.asset.symbol, },
    { url: strategy.network.icon, alt: strategy.network.name, small: true },
  ];

  return (
    <div className="flex flex-col my-3">
      <div className="mb-1">WITH</div>
      <div className="flex flex-col md:flex-row p-3 border border-solid border-gray-500 rounded-xl bg-dark-600">
        <div className="
          flex flex-row rounded-xl bg-gray-500 px-3 cursor-pointer my-auto py-2
          hover:bg-primary hover:text-dark"
          onClick={ onTokenClick }
        >
          <div className="my-auto">
            <IconGroup icons={ icons }/>
          </div>
          <div className="flex flex-col ps-3 py-3 bg-medium my-auto">
            <div className="text-2xl font-bold">{ strategy.asset.symbol }</div>
            <div className="-mt-2 w-32">on { strategy.network.name }</div>
          </div>
        </div>
        <div className="flex flex-col ms-auto my-auto text-right">
          <div className="text-sm flex flex-row align-middle ms-auto bg-gray-200 rounded px-1">
            <WalletIcon className="flex me-1 my-auto h-4 w-4"/>
            <span className="flex my-auto"> { balance } </span>
          </div>
          <div className="flex ms-auto ms-auto">
            <input
              type="number"
              className="input py-1 my-2 font-bold text-xl text-right ms-auto w-full basis-4/5"
              value={number}
              onChange={ handleInputChange }
            />
          </div>
          <div className="text-sm text-gray font-bold">~{ dollarEquivalent }</div>
        </div>
      </div>
    </div>
  )
}

export default DepositWith;