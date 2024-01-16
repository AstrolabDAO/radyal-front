import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { SwapContext } from "~/context/swap-context";

import { Web3Context } from "~/context/web3-context";
import { usePrices } from "~/hooks/store/tokens";
import NetworkSelect, { NetworkSelectData } from "./NetworkSelect";
import ModalLayout from "./layout/ModalLayout";
import SelectTokenLine from "./select-token/SelectTokenLine";

const SelectToken = ({ tokens, onSelect }) => {
  const { networks } = useContext(Web3Context);
  const [search, setSearch] = useState("");
  const [networksFilter, setNetworksFilter] = useState([]);

  const { switchSelectMode } = useContext(SwapContext);

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
      <div
        className="overflow-y-scroll"
        style={{ maxHeight: "calc(100vh - 450px)" } }
      >
        { displayedTokens.map((token, index) => {
          return (
            <SelectTokenLine
              key={ `token-line-${index}` }
              token={ token }
              tokenPrices={ tokenPrices }
              onSelect={ onSelect }
              switchSelectMode={ switchSelectMode }
              haveBorder={ index !== tokens.length - 1 }
            />
          )
        })}
        <div ref={loadMoreRef} />
      </div>
    </ModalLayout>
  );
};
export default SelectToken;
