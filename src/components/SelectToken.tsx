import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

  const [displayedTokens, setDisplayedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

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

  useEffect(() => {
    setDisplayedTokens(filteredTokens.slice(0, 100));
  }, [filteredTokens]);

  const loadMoreTokens = useCallback(() => {
    if (loading) return;
    setLoading(true);

    setDisplayedTokens((prevTokens) => [
      ...prevTokens,
      ...filteredTokens.slice(prevTokens.length, prevTokens.length + 100),
    ]);
    setLoading(false);
  }, [filteredTokens, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreTokens();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, loadMoreTokens, loading]);

  return (
    <ModalLayout title="Select token" className="max-h-screen min-h-96">
      <header>
        <label>Search by name...</label>
        <input
          type="text"
          placeholder="USDC..."
          className="input w-full border-0"
          onChange={({ target }) => {
            setSearch(target.value);
          }}
        />
        <div className="my-2">Filter by network</div>
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
        {displayedTokens.map((token, index) => {
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
              key={ `token-${index}` }
              className={clsx(
                "flex flex-col cursor-pointer mb-2 pt-2.5 pb-1.5 px-2 rounded-xl",
                index !== tokens.length - 1 && "border-b",
                "hover:bg-primary hover:text-dark"
              )}
              onClick={() => { switchSelectMode(); onSelect(token); }}
            >
              <div className="flex flex-row w-full items-center">
                <IconGroup icons={icons} />
                <div className="ms-4">
                  <span className="text-xl font-bold"> {token?.symbol} </span>
                  <span className="text-xs">
                    ({token.network.name})
                  </span>
                </div>
                <div className="ms-auto">
                  <span className="whitespace-nowrap block">
                    <span className="font-bold">
                      {lisibleAmount(convertedBalance, 4)} </span>
                      {token.symbol}
                  </span>
                </div>
              </div>
              <div className="ms-auto -mt-2 text-xs">
                ~{lisibleAmount(tokenPrice, 4)} $
              </div>
            </div>
          );
        })}
        <div ref={loadMoreRef} />
      </div>
    </ModalLayout>
  );
};
export default SelectToken;
