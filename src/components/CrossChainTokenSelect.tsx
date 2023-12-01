import { useContext, useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import IconGroup from "./IconGroup";
import clsx from "clsx";
import { SwapContext } from "~/context/swap-context";
import Loader from "./Loader";

const CrossChainTokenSelect = ({
  selected,
  locked = false,
  isReceive = false,
}) => {
  const [depositValue, setDepositValue] = useState("");

  const { estimate, switchSelectMode, receiveEstimation, estimationPromise } =
    useContext(SwapContext);

  const { tokenPrices } = useContext(TokensContext);

  const { toAmount } = useMemo(() => {
    if (!receiveEstimation) return { toAmount: 0 };
    return receiveEstimation;
  }, [receiveEstimation]);

  const icons = useMemo(
    () => [
      { url: selected?.network?.icon, alt: selected?.network?.name },
      { url: selected?.icon, alt: selected?.symbol, small: true },
    ],
    [selected]
  );
  const selectedBalance = useMemo(() => {
    if (!selected || (selected && !selected.amount)) return 0;
    return amountToEth(BigInt(selected.amount ?? 0), selected.decimals);
  }, [selected]);

  const tokenPrice = useMemo(() => {
    if (!selected) return 0;

    const price = Number(tokenPrices[selected?.coinGeckoId]?.usd);

    return isNaN(price) ? 0 : price;
  }, [tokenPrices, selected]);

  useEffect(() => {
    estimate(depositValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositValue]);

  return (
    <div className="relative">
      <div className="p-2 w-full card">
        <div>
          <header className="flex justify-end text-xs mb-2 items-center">
            <span className="w-full">{!isReceive && "Depositing"}</span>
            <span className="whitespace-nowrap block mr-2">
              Balance: {lisibleAmount(selectedBalance)}{" "}
            </span>
            {!isReceive && (
              <div>
                <button
                  className="btn btn-xs"
                  onClick={() => {
                    const rounredValue =
                      Math.round(selectedBalance * 100) / 100;
                    setDepositValue(rounredValue.toString());
                  }}
                >
                  max
                </button>
              </div>
            )}
          </header>
          <div
            className={clsx("flex items-center", {
              "cursor-pointer": !locked,
            })}
          >
            <div
              className="flex items-center w-full"
              onClick={() => {
                if (!locked) switchSelectMode();
              }}
            >
              <Loader state={selected}>
                <IconGroup icons={icons} className="mr-6" />
                <span className="text-2xl mr-2">{selected?.symbol}</span>
                {!locked && <FaChevronDown className="mr-2" />}
              </Loader>
            </div>
            {isReceive && (
              <div className="w-full text-right text-4xl">
                <Loader promise={estimationPromise}>
                  {lisibleAmount(toAmount, 4)}
                </Loader>
              </div>
            )}
            {!isReceive && (
              <input
                className="input w-full max-w-xs text-right text-4xl"
                type="text"
                placeholder="100"
                value={depositValue}
                onChange={({ target }) => {
                  setDepositValue(target.value.replace(/[^0-9]/g, ""));
                }}
              />
            )}
          </div>
          <footer className="flex justify-end text-xs items-center mt-2">
            <span className="w-full">
              {selected && (
                <>
                  {selected.name} ({selected.network.name})
                </>
              )}
            </span>
            <i>~ </i>
            <span>
              {lisibleAmount(
                Number(isReceive ? toAmount : depositValue) * tokenPrice
              )}
              $
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CrossChainTokenSelect;
