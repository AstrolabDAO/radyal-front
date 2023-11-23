import IconGroup from "./IconGroup";
import { networkByChainId } from "~/utils/mappings";
import { lisibleAmount } from "~/utils/format";
import { useContext } from "react";
import { SwapModalContext } from "~/context/swap-modal-context";
import Loader from "./Loader";

const ReceiveInput = () => {
  const { receiveEstimation, estimationPromise } = useContext(SwapModalContext);

  const { toAmountUSD, toAmount, toToken } = receiveEstimation;
  const network = toToken?.network
    ? toToken.network
    : networkByChainId[toToken.chainId];

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
      <div className="p-2 w-full card">
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
              <Loader promise={estimationPromise}>
                {lisibleAmount(toAmount)}
              </Loader>
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
