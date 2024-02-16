import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Web3Context } from "~/context/web3-context";

import { usePrices } from "~/hooks/tokens";

import { Token } from "~/utils/interfaces";

import { switchSelection } from "~/services/swapper";
import NetworkSelect, { NetworkSelectData } from "../NetworkSelect";
import { Input } from "../styled";
import SelectTokenLine from "./SelectTokenLine";

type SelectTokenProps = {
  tokens: Array<Token>;
  onSelect: (token: Token) => void;
  onBackClick: () => void;
};
const SelectToken = ({ tokens, onSelect, onBackClick }: SelectTokenProps) => {
  const { networks } = useContext(Web3Context);

  const [search, setSearch] = useState("");
  const [networksFilter, setNetworksFilter] = useState([]);

  const [displayedTokens, setDisplayedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const tokenPrices = usePrices();
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
    <>
      <header>
        <div className="flex flex-row mt-6">
          <div className="basis-3/5 pe-1.5">
            <label className="flex mb-1">Search by name</label>
            <Input
              type="text"
              placeholder="USDC..."
              onChange={({ target }) => {
                setSearch(target.value);
              }}
            />
          </div>
          <div className="basis-2/5">
            <div className="flex mb-1">Filter by network</div>
            <NetworkSelect
              className="z-50 relative"
              isSearchable={false}
              networks={networks}
              onChange={(value: Array<NetworkSelectData>) => {
                setNetworksFilter(value.map((v) => v.network?.slug));
              }}
            />
          </div>
        </div>
      </header>
      <div
        className="mt-4 overflow-y-scroll"
        style={{ maxHeight: "calc(100vh - 450px)" }}
      >
        {displayedTokens.map((token, index) => {
          return (
            <SelectTokenLine
              key={`token-line-${index}`}
              token={token}
              tokenPrices={tokenPrices}
              onSelect={onSelect}
              switchSelectMode={switchSelection}
              haveBorder={index !== tokens.length - 1}
            />
          );
        })}
        <div ref={loadMoreRef} />
      </div>
    </>
  );
};
export default SelectToken;
