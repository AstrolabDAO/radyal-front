import { useContext, useMemo, useState } from "react";
import { TokensContext } from "~/context/tokens-context";
import { amountToEth, lisibleAmount } from "~/utils/format";
import IconGroup from "./IconGroup";
import clsx from "clsx";
import { SwapContext } from "~/context/swap-context";
import { balanceBySlug } from "~/utils/mappings";

import { Web3Context } from "~/context/web3-context";
import NetworkSelect, { NetworkSelectData } from "./NetworkSelect";
import ModalLayout from "./layout/ModalLayout";

const SelectToken = ({ tokens, onSelect }) => {
  const { tokenPrices } = useContext(TokensContext);

  const { networks } = useContext(Web3Context);

  const [search, setSearch] = useState("");
  const [networksFilter, setNetworksFilter] = useState([]);

  const { switchSelectMode } = useContext(SwapContext);

  const filteredTokens = useMemo(() => {
    return tokens
      .filter(({ network }) => {
        if (!networksFilter.length) return true;
        return networksFilter.includes(network.slug);
      })
      .filter(({ symbol }) =>
        symbol.toString().toLowerCase().includes(search.toLowerCase())
      );
  }, [search, tokens, networksFilter]);

  return (
    <ModalLayout title="Select token">
      <header>
        <label>search by name...</label>
        <input
          type="text"
          placeholder="USDC..."
          className="input input-bordered w-full"
          onChange={({ target }) => {
            setSearch(target.value);
          }}
        />
        <hr />
        <div className="my-2">filter by network</div>
        <NetworkSelect
          isSearchable
          networks={networks}
          className="basic-multi-select w-full mb-8"
          classNamePrefix="select"
          onChange={(value: Array<NetworkSelectData>) => {
            setNetworksFilter(value.map((v) => v.network?.slug));
          }}
        />
      </header>
      <div>
        {filteredTokens.map((token, index) => {
          const convertedPrice = Number(tokenPrices[token.coinGeckoId]?.usd);
          const tokenPrice = isNaN(convertedPrice) ? 0 : convertedPrice;

          const balance = balanceBySlug[token.slug]?.amount ?? 0;

          const convertedBalance = amountToEth(
            !balance ? BigInt(0) : BigInt(balance),
            token.decimals
          );

          const icons = [
            { url: token?.icon, alt: token?.symbol },
            {
              url: token?.network?.icon,
              alt: token?.network?.name,
              small: true,
            },
          ];

          return (
            <div
              key={index}
              className={clsx(
                "flex items-center cursor-pointer py-4 border-white-800 border-b-solid overflow-scroll",
                index !== tokens.length - 1 && "border-b",
                "hover:bg-base"
              )}
              onClick={() => {
                switchSelectMode();
                onSelect(token);
              }}
            >
              <div className="flex w-full">
                <IconGroup icons={icons} className="mr-6" />
                <span className="text-xl mr-2">
                  {token?.symbol} ({token.network.name})
                </span>
              </div>
              <div>
                <div className="text-right">
                  <span className="whitespace-nowrap block">
                    Balance: {lisibleAmount(convertedBalance, 4)}
                    {token.symbol}
                  </span>
                </div>
                <div className="text-xs text-right">
                  ~{lisibleAmount(convertedBalance * tokenPrice)}$
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModalLayout>
  );
};
export default SelectToken;
