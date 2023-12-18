import clsx from "clsx";
import { useContext, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";

import IconGroup from "./IconGroup";
import Loader from "./Loader";
import { SwapContext } from "~/context/swap-context";

const CrossChainTokenSelect = ({ selected, locked = false }) => {
  const { switchSelectMode } = useContext(SwapContext);

  const icons = useMemo(
    () => [
      { url: selected?.icon, alt: selected?.symbol },
      {
        url: selected?.network?.icon,
        alt: selected?.network?.name,
        small: true,
      },
    ],
    [selected]
  );

  return (
    <div className="card bg-base-100 p-4 flex-1">
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
          <Loader value={selected}>
            <IconGroup icons={icons} className="mr-6" />
            <span className="text-xl mr-2">{selected?.symbol}</span>
            {!locked && <FaChevronDown className="mr-2" />}
          </Loader>
        </div>
      </div>
    </div>
  );
};

export default CrossChainTokenSelect;
