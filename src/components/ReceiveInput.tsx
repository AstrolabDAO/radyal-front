import { FaChevronDown } from "react-icons/fa";

import IconGroup from "./IconGroup";
import { networkByChainId } from "~/utils/mappings";
import { lisibleAmount } from "~/utils/format";

const ReceiveInput = ({ receive }) => {
  if (!receive) return null;
  const { toAmountUSD, toAmount, toToken } = receive;
  console.log(
    "🚀 ~ file: ReceiveInput.tsx:10 ~ ReceiveInput ~ toAmount:",
    toAmount
  );

  const network = networkByChainId[toToken.chainId];

  const icons = [
    { url: network.icon, alt: network?.name },
    {
      url: `/tokens/${toToken.symbol.toLowerCase()}.svg`,
      alt: toToken?.symbol,
      small: true,
    },
  ];
  return (
    <div className="relative">
      <div className="p-2 w-full card border-gray-200 border-solid border">
        <div>
          <header className="flex justify-end text-xs mb-2">
            <span className="w-full">Depositing</span>
            {/*<span className="whitespace-nowrap block mr-2">Balance: 0.00</span>*/}
          </header>
          <div className="flex items-center">
            <div className="flex">
              <IconGroup icons={icons} className="mr-6" />
              <span className="text-2xl mr-2">{toToken.symbol}</span>
            </div>
            <div className="w-full text-right text-4xl">
              {lisibleAmount(toAmount)}
            </div>
          </div>
          <footer className="flex justify-end text-xs items-center mt-2">
            <span className="w-full">
              {toToken.name} ({network.name})
            </span>
            <i>~</i>
            <span>{toAmountUSD}$</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ReceiveInput;
