import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Web3Context } from "~/context/web3-context";
import { usePrices } from "~/hooks/store/tokens";
import NetworkSelect, { NetworkSelectData } from "./NetworkSelect";
import ModalLayout from "./layout/ModalLayout";
import SelectTokenLine from "./select-token/SelectTokenLine";

import { FaChevronLeft } from "react-icons/fa";
import { useSwitchSelection } from "~/hooks/store/swapper";
import { Token } from "~/utils/interfaces";

type SelectTokenProps = {
  tokens: Array<Token>;
  onSelect: (token: Token) => void;
  onBackClick: () => void;
};
const SelectToken = ({ tokens, onSelect, onBackClick }: SelectTokenProps) => {
  const { networks } = useContext(Web3Context);
  const [search, setSearch] = useState("");
  const [networksFilter, setNetworksFilter] = useState([]);

  const switchSelectMode = useSwitchSelection();

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
    <ModalLayout className="max-h-screen min-h-96">
      <header>
        <div className="flex flex-row mb-3">
          <FaChevronLeft
            className="cursor-pointer my-auto hover:text-primary"
            onClick={onBackClick}
          />
          <div className="flex-grow text-center font-bold text-2xl uppercase text-white">
            Token Select
          </div>
        </div>
        <div className="flex flex-row mt-8">
          <div className="basis-2/3 pe-2">
            <label className="flex mb-1">Search by name...</label>
            <input
              type="text"
              placeholder="USDC..."
              className="input w-full border-0 focus:none bg-dark-700"
              onChange={({ target }) => {
                setSearch(target.value);
              }}
            />
          </div>
          <div className="basis-1/3">
            <div className="flex mb-1">Filter by network</div>
            <NetworkSelect
              isSearchable
              networks={networks}
              className="basic-multi-select w-full mb-8"
              classNamePrefix="select"
              onChange={(value: Array<NetworkSelectData>) => {
                setNetworksFilter(value.map((v) => v.network?.slug));
              }}
            />
          </div>
        </div>
      </header>
      <div
        className="overflow-y-scroll pe-2"
        style={{ maxHeight: "calc(100vh - 450px)" }}
      >
        {displayedTokens.map((token, index) => {
          return (
            <SelectTokenLine
              key={`token-line-${index}`}
              token={token}
              tokenPrices={tokenPrices}
              onSelect={onSelect}
              switchSelectMode={switchSelectMode}
              haveBorder={index !== tokens.length - 1}
            />
          );
        })}
        <div ref={loadMoreRef} />
      </div>
    </ModalLayout>
  );
};
export default SelectToken;
