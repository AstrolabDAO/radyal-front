import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount } from "wagmi";
import { Token } from "~/utils/interfaces";
import { StrategyContext } from "./strategy-context";
import { TokensContext } from "./tokens-context";
import { generateRequest } from "~/utils/lifi";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

let debounceTimer;

interface SwapContextType {
  estimate: (depositValue: number) => void;
  switchSelectMode: () => void;
  selectFromToken: (token: Token) => void;
  selectToToken: (token: Token) => void;
  updateFromValue: (value: string) => void;
  fromToken: Token;
  toToken: Token;
  fromValue: string;
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
  updateFromValue: () => {},
  fromToken: null,
  toToken: null,
  fromValue: null,
  sortedBalances: [],
  receiveEstimation: null,
  selectTokenMode: false,
  estimationPromise: null,
});

export const SwapProvider = ({ children }) => {
  const { address } = useAccount();
  const { selectedStrategy } = useContext(StrategyContext);
  const [fromValue, setFromValue] = useState<string>(null);

  const [receiveEstimation, setReceiveEstimation] = useState(0);
  const [estimationPromise, setEstimationPromise] = useState(null);
  const [selectTokenMode, setSelectTokenMode] = useState(false);

  const { sortedBalances } = useContext(TokensContext);
  const { tokenBySlug, tokensBySlug, tokens } = useContext(TokensContext);

  const [fromToken, setFromToken] = useState<Token>(null);

  const [toToken, setToToken] = useState<Token>(null);

  const queryClient = useQueryClient();

  const estimate = (depositValue: number) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!fromToken || !depositValue) return;

      queryClient
        .fetchQuery(
          `estimate-${depositValue}`,
          async () => {
            const promise = generateRequest({
              estimateOnly: true,
              address: address,
              fromToken,
              toToken,
              amount: depositValue,
              strat: selectedStrategy,
            })
              .then(({ estimatedExchangeRate }) => {
                const receiveEstimation =
                  Number(depositValue) * Number(estimatedExchangeRate);

                return receiveEstimation;
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
            return promise;
          },
          {
            staleTime: 1000 * 15,
            cacheTime: 1000 * 15,
          }
        )
        .then((estimation) => {
          setReceiveEstimation(estimation as number);
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
      const token = tokenBySlug(sortedBalances?.[0]?.slug) ?? null;

      selectFromToken(token);
    }
    if (!toToken) {
      const token = selectedStrategy ? selectedStrategy.token : tokens[0];
      selectToToken(token);
    }
  }, [
    sortedBalances,
    fromToken,
    tokensBySlug,
    tokenBySlug,
    selectedStrategy,
    tokens,
    toToken,
  ]);

  const updateFromValue = useCallback((value: string) => {
    console.log(
      "🚀 ~ file: swap-context.tsx:139 ~ updateFromValue ~ value:",
      value
    );
    setFromValue(value);
  }, []);

  return (
    <SwapContext.Provider
      value={{
        estimate,
        switchSelectMode,
        selectFromToken,
        selectToToken,
        updateFromValue,
        fromToken,
        toToken,
        fromValue,
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
