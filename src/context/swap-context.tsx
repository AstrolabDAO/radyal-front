import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { getRoute } from "~/utils/squid";
import { WalletContext } from "./wallet-context";
import { GetRouteResult, Token } from "~/utils/interfaces";
import { StrategyContext } from "./strategy-context";
import {
  networkByChainId,
  networkBySlug,
  tokenBySlug as tokenBySlugMapping,
} from "~/utils/mappings";
import { useAccount } from "wagmi";
import { TokensContext } from "./tokens-context";

let debounceTimer;

interface SwapContextType {
  estimate: (depositValue: string) => void;
  switchSelectMode: () => void;
  selectFromToken: (token: Token) => void;
  selectToToken: (token: Token) => void;
  fromToken: Token;
  toToken: Token;
  sortedBalances: any;
  receiveEstimation: any;
  selectTokenMode: boolean;
  estimationPromise: Promise<any>;
}
export const SwapContext = createContext<SwapContextType>({
  estimate: () => {},
  switchSelectMode: () => {},
  selectFromToken: () => {},
  selectToToken: () => {},
  fromToken: null,
  toToken: null,
  sortedBalances: [],
  receiveEstimation: null,
  selectTokenMode: false,
  estimationPromise: null,
});

export const SwapProvider = ({ children }) => {
  const { address } = useAccount();
  const { selectedStrategy } = useContext(StrategyContext);
  const [receiveEstimation, setReceiveEstimation] = useState<GetRouteResult>({
    toAmount: 0,
    toToken: selectedStrategy.token,
  });
  const [estimationPromise, setEstimationPromise] = useState(null);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  const { sortedBalances } = useContext(WalletContext);
  const { tokenBySlug } = useContext(TokensContext);

  const [fromToken, setFromToken] = useState<Token>(null);

  const [toToken, setToToken] = useState<Token>(selectedStrategy?.token);

  const estimate = (depositValue: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!fromToken || !depositValue) return;
      const promise = getRoute({
        fromAddress: address,
        toAddress: address,
        fromChain: fromToken.network.id,
        fromToken: fromToken.address,
        fromAmount: ethers
          .parseUnits(depositValue, fromToken.decimals)
          .toString(),
        toChain: toToken.network.id,
        toToken: toToken.address,
      })
        .then((result) => {
          const { estimate, params } = result;
          const { fromToken, toToken } = estimate;

          const fromNetwork = networkByChainId[params.fromChain];
          const toNetwork = networkByChainId[params.toChain];

          setReceiveEstimation({
            route: result,
            fromToken: {
              ...fromToken,
              address: fromToken.address as `0x${string}`,
              network: fromNetwork,
              slug: `${
                fromNetwork.slug
              }:${fromToken.symbol.toLocaleLowerCase()}`,
            },
            toToken: {
              ...toToken,
              address: toToken.address as `0x${string}`,
              network: toNetwork,
              slug: `${toNetwork.slug}:${toToken.symbol.toLocaleLowerCase()}`,
            },
            toAmount: Number(estimate.toAmount) / 10 ** toToken.decimals,
          });
        })
        .catch((err) => {
          console.error(err);
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

  const selectFromToken = (token: Token) => setFromToken(token);
  const selectToToken = (token: Token) => setToToken(token);

  useEffect(() => {
    if (!fromToken) {
      const token = tokenBySlug(sortedBalances?.[0].slug) ?? null;
      console.log(
        "🚀 ~ file: swap-context.tsx:120 ~ useEffect ~ tokenBySlug:",
        tokenBySlugMapping
      );

      console.log(
        "🚀 ~ file: swap-context.tsx:129 ~ useEffect ~ networkBySlug:",
        networkBySlug
      );
      console.log(
        "🚀 ~ file: swap-context.tsx:120 ~ useEffect ~ sortedBalances?.[0].slug:",
        sortedBalances?.[0].slug
      );
      console.log(
        "🚀 ~ file: swap-context.tsx:121 ~ useEffect ~ token:",
        token
      );
      selectFromToken(token);
    }
  }, [sortedBalances, fromToken]);

  return (
    <SwapContext.Provider
      value={{
        estimate,
        switchSelectMode,
        selectFromToken,
        selectToToken,
        fromToken,
        toToken,
        sortedBalances,
        receiveEstimation,
        selectTokenMode,
        estimationPromise,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
