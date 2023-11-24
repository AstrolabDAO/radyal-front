import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { getRoute } from "~/utils/squid";
import { WalletContext } from "./wallet-context";
import { GetRouteResult, Token } from "~/utils/interfaces";
import { StrategyContext } from "./strategy-context";
import { networkByChainId } from "~/utils/mappings";
import { TokenData } from "@0xsquid/sdk";

let debounceTimer;

interface SwapModalContextType {
  estimate: (depositValue: string) => void;
  switchSelectMode: () => void;
  selectToken: (token: Token) => void;
  selectedToken: any;
  sortedTokens: any;
  receiveEstimation: any;
  selectTokenMode: boolean;
  estimationPromise: Promise<any>;
}
export const SwapModalContext = createContext<SwapModalContextType>({
  estimate: () => {},
  switchSelectMode: () => {},
  selectToken: () => {},
  selectedToken: null,
  sortedTokens: [],
  receiveEstimation: null,
  selectTokenMode: false,
  estimationPromise: null,
});

export const SwapModalProvider = ({ children }) => {
  const { selectedStrategy } = useContext(StrategyContext);

  const [receiveEstimation, setReceiveEstimation] = useState<GetRouteResult>({
    toAmountUSD: 0,
    toAmount: 0,
    toToken: selectedStrategy.token,
  });
  const [estimationPromise, setEstimationPromise] = useState(null);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  const { balances } = useContext(WalletContext);

  const sortedTokens = useMemo(() => {
    return balances.sort((a, b) =>
      BigInt(a.amount) > BigInt(b.amount) ? -1 : 1
    );
  }, [balances]);

  const [selectedToken, setSelectedToken] = useState(sortedTokens?.[0] ?? null);

  const estimate = (depositValue: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!selectedToken || !depositValue) return;
      const promise = getRoute({
        fromChain: selectedToken.network.id,
        fromToken: selectedToken.address,
        fromAmount: ethers
          .parseUnits(depositValue, selectedToken.decimals)
          .toString(),
      })
        .then((result) => {
          const { estimate, params } = result;
          const { fromToken, toToken } = params;

          const fromNetwork = networkByChainId[params.fromChain];
          const toNetwork = networkByChainId[params.toChain];

          setReceiveEstimation({
            route: result,
            fromToken: {
              ...(fromToken as TokenData),
              address: fromToken.address as `0x${string}`,
              network: fromNetwork,
              slug: `${
                fromNetwork.slug
              }:${fromToken.symbol.toLocaleLowerCase()}`,
            },
            toToken: {
              ...(toToken as TokenData),
              address: toToken.address as `0x${string}`,
              network: toNetwork,
              slug: `${toNetwork.slug}:${toToken.symbol.toLocaleLowerCase()}`,
            },
            toAmountUSD: Number(estimate.toAmountUSD),
            toAmount: Number(estimate.toAmount) / 10 ** params.toToken.decimals,
          });
        })
        .catch(() => {
          toast.error("route not found from Swapper");
        });

      setEstimationPromise(promise);
      toast.promise(promise, {
        pending: "Calculating...",
        error: "route not found from Swapper 🤯",
      });
    }, 1000);
  };

  const switchSelectMode = () => {
    setSelectTokenMode(!selectTokenMode);
  };

  const selectToken = (token: Token) => setSelectedToken(token);

  useEffect(() => {
    if (!selectedToken) setSelectedToken(sortedTokens?.[1] ?? null);
  }, [sortedTokens, selectedToken]);

  return (
    <SwapModalContext.Provider
      value={{
        estimate,
        switchSelectMode,
        selectToken,
        selectedToken,
        sortedTokens,
        receiveEstimation,
        selectTokenMode,
        estimationPromise,
      }}
    >
      {children}
    </SwapModalContext.Provider>
  );
};
