import { useMemo } from "react";
import StrategyHeader from "./StrategyHeader";

import { useSelectedStrategy } from "~/hooks/strategies";

import { shortenAddress } from "@astrolabs/swapper";
import Link from "~/assets/icons/link.svg";
import { useReadContract } from "wagmi";

const InfoTab = () => {
  const selectedStrategy = useSelectedStrategy();

  const agent = useReadContract({
    functionName: "agent",
    address: selectedStrategy.address,
    abi: selectedStrategy.abi,
    chainId: selectedStrategy.network.id,
  });

  const links = useMemo(() => {
    const network = selectedStrategy?.network;
    const explorerUrl = network?.explorers[0];
    return [
      {
        href: `${explorerUrl}/contract/${selectedStrategy.address}`,
        label: "Strategy",
        content: shortenAddress(selectedStrategy.address),
      },
      {
        href: `${explorerUrl}/address/${selectedStrategy.address}`,
        label: "Agent",
        content: shortenAddress(selectedStrategy.address),
      },
      { href: null, label: "Allocator", content: "-" },
      { href: null, label: "Bridge Connector", content: "-" },
    ];
  }, [selectedStrategy, agent]);
  return (
    <>
      <div>
        <StrategyHeader strategy={selectedStrategy} />
      </div>
      <div className="flex flex-col pt-3 relative gap-3">
        <div className="uppercase mt-2 font-medium">Contract addresses</div>
        <table className="shadow-none border-none w-32">
          <tbody>
            {links.map((link, index) => {
              return (
                <tr key={`link-${index}`}>
                  <td>{link.label}: </td>
                  <td align="right">
                    {link.href && (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 px-2 flex text-white hover:text-primary w-full"
                      >
                        <span className="inline-block px-2">
                          {link.content}
                        </span>
                        <img
                          className="invert w-4 inline"
                          src={Link}
                          alt="link"
                        />
                      </a>
                    )}
                    {!link.href && (
                      <span>
                        {
                          <>
                            <span className="inline-block px-2">
                              {link.content}
                            </span>
                          </>
                        }
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ul className="font-xs"></ul>
      </div>
    </>
  );
};

export default InfoTab;
