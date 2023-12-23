import { useState } from "react";
import IconGroup from "~/components/IconGroup";
import { Strategy } from "~/utils/interfaces";

const DepositWith = ({ strategy } : { strategy: Strategy }) => {
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
      <div className="ms-3 mb-2 text-xl">WITH</div>
      <div className="flex flex-row py-3 px-3 border border-solid border-gray-500 rounded-xl bg-dark-600">
        <div className="flex flex-row rounded-xl bg-gray-500 px-3">
          <div className="my-auto">
            <IconGroup icons={ icons }/>
          </div>
          <div className="flex flex-col p-3 bg-medium my-auto">
            <div className="text-3xl font-bold">{ strategy.asset.symbol }</div>
            <div className="-mt-2">on { strategy.network.name }</div>
          </div>
        </div>
        <div className="flex flex-col p-3 ms-auto my-auto text-right">
          <div className="text-sm font-bold">{ balance }</div>
          <input
            type="number"
            value={number}
            onChange={ handleInputChange }
          />
          <div className="text-sm text-gray font-bold">~{ dollarEquivalent }</div>
        </div>
      </div>
    </div>
  )
}

export default DepositWith;