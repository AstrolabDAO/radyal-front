import { useState } from "react";
import IconGroup from "~/components/IconGroup";

const DepositFor = () => {
  const tokenName = "USDC";
  const networkName = "Arbitrum";
  const balance = 245000000;
  const dollarEquivalent = 0;

  const [number, setNumber] = useState('');
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setNumber(newValue);
  };

  const icons = [
    { url: '/tokens/usdc.svg', alt: 'usdc', },
    { url: '/networks/gnosis.svg', alt: 'gnosis', small: true },
  ];

  return (
    <div className="flex flex-col">
      <div className="ms-3 mb-2 text-xl">FOR</div>
      <div className="flex flex-row p-3 border border-solid border-gray-500 rounded-xl">
        <div className="flex flex-row px-3">
          <div className="my-auto">
            <IconGroup icons={ icons }/>
          </div>
          <div className="flex flex-col p-3 bg-medium my-auto">
            <div className="text-3xl font-bold">{ tokenName }</div>
            <div className="-mt-2">on { networkName }</div>
          </div>
        </div>
        <div className="flex flex-col p-3 ms-auto my-auto text-right">
          <div className="text-sm font-bold">{ balance }</div>
          <input
            type="number"
            value={number}
            onChange={ handleInputChange }
          />
          <div className="text-sm font-bold">~{ dollarEquivalent }</div>
        </div>
      </div>
    </div>
  )
}

export default DepositFor;