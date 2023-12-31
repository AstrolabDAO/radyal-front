import { useContext, useMemo, useState } from "react";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import clsx from "clsx";
import { SwapContext } from "~/context/swap-context";
import Loader from "./Loader";
import { balanceBySlug } from "~/utils/mappings";
import CrossChainTokenSelect from "./CrossChainTokenSelect";

const SwapInput = ({
  selected,
  className = "",
  isDestination = false,
  locked = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: number) => {},
}) => {
  const { toValue, fromValue } = useContext(SwapContext);

  const [depositValue, setDepositValue] = useState<string>(
    isDestination ? null : fromValue?.toString() ?? null
  );

  const { tokenPrices } = useContext(TokensContext);

  const selectedBalance = useMemo(() => {
    if (!selected) return 0;
    const balance = balanceBySlug[selected.slug];

    return amountToEth(BigInt(balance?.amount ?? 0), selected.decimals);
  }, [selected]);

  console.log(
    "🚀 ~ file: SwapInput.tsx:32 ~ selectedBalance ~ selectedBalance:",
    selectedBalance
  );

  const tokenPrice = useMemo(() => {
    if (!selected || !tokenPrices) return 0;

    const { sharePrice, asset, weiPerUnit } = selected;
    const price = Number(
      tokenPrices[asset ? asset?.coinGeckoId : selected?.coinGeckoId]?.usd
    );

    const priceValue = sharePrice ? (price * sharePrice) / weiPerUnit : price;

    return isNaN(priceValue) ? 0 : priceValue;
  }, [tokenPrices, selected]);

  return (
    <div className={clsx("relative bg-base-100 card p-4 py-2", className)}>
      <div className="p-2 w-full">
        <header className="flex text-xs mb-2 items-center">
          <h2 className="text-xl transform-uppercase">
            {!isDestination ? "You pay" : "You receive"}
          </h2>
          <div></div>
        </header>
        <div className="flex">
          <CrossChainTokenSelect selected={selected} locked={locked} />
          {isDestination && (
            <div className="flex-0">
              <div className="text-left text-4xl ml-4">
                <Loader value={toValue}>{lisibleAmount(toValue, 4)}</Loader>
              </div>
              <div className="pl-2">
                <i>~ </i>
                <span>
                  {lisibleAmount(
                    Number(isDestination ? toValue : depositValue) * tokenPrice
                  )}
                  $
                </span>
              </div>
            </div>
          )}
          {!isDestination && (
            <div>
              <input
                className="input text-left text-4xl bg-transparent w-full"
                type="text"
                placeholder="100"
                value={depositValue?.toString() ?? ""}
                onChange={({ target }) => {
                  const replace = target.value
                    .replace(/[^0-9.,]/g, "")
                    .replace(",", ".")
                    .replace(/^[.]$/, "0.");

                  setDepositValue(replace);
                  onChange(Number(replace));
                }}
              />
              <div className="pl-2">
                <i>~ </i>
                <span>
                  {lisibleAmount(
                    Number(isDestination ? toValue : depositValue) * tokenPrice
                  )}
                  $
                </span>
              </div>
            </div>
          )}
        </div>
        <footer className="flex justify-end text-xs items-center mt-2">
          <span className="whitespace-nowrap block mr-2">
            Balance: {lisibleAmount(selectedBalance)}{" "}
          </span>
          {!isDestination && (
            <div>
              <button
                className="badge badge-primary"
                onClick={() => {
                  const rounredValue = Math.round(selectedBalance * 100) / 100;
                  setDepositValue(rounredValue.toString());
                }}
              >
                max
              </button>
            </div>
          )}
          {/** 
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
                Number(isDestination ? toValue : depositValue) * tokenPrice
              )}
              $
            </span>
            */}
        </footer>
      </div>
    </div>
  );
};

export default SwapInput;
