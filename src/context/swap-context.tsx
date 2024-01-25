import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tokensIsEqual } from "~/utils";
import { StrategyInteraction } from "~/utils/constants";
import { Strategy, Token } from "~/utils/interfaces";
import { tokenBySlug, tokensBySlugForPriceAPI } from "~/utils/mappings";
import { EstimationProvider } from "./estimation-context";
import { StrategyContext } from "./strategy-context";

import { TokensContext } from "./tokens-context";

const SwapContext = createContext<SwapContextType>({
  switchSelectMode: () => {},
  selectFromToken: () => {},
  selectToToken: () => {},
  setAction: () => {},
  setCanSwap: () => {},
  setFromValue: () => {},
  fromToken: null,
  toToken: null,
  fromValue: null,
  canSwap: false,

  action: StrategyInteraction.DEPOSIT,
  selectTokenMode: false,
  actionNeedToSwap: false,
});

const SwapProvider = ({ children }) => {
  const { sortedBalances } = useContext(TokensContext);
  const { selectedStrategy } = useContext(StrategyContext);

  const [action, setAction] = useState<StrategyInteraction>(
    StrategyInteraction.DEPOSIT
  );

  const [selectTokenMode, setSelectTokenMode] = useState(false);

  const [fromToken, setFromToken] = useState<Token | Strategy>(null);
  const [toToken, setToToken] = useState<Token | Strategy>(null);

  const [canSwap, setCanSwap] = useState(false);

  const [fromValue, setFromValue] = useState<number>(null);

  const selectFromToken = useCallback(
    (from: Token | Strategy) => setFromToken(from),
    []
  );
  const selectToToken = useCallback(
    (to: Token | Strategy) => setToToken(to),
    []
  );

  useEffect(() => {
    if (fromToken) tokensBySlugForPriceAPI[fromToken?.slug] = fromToken;
    if (toToken) tokensBySlugForPriceAPI[toToken?.slug] = toToken;
  }, [fromToken, toToken]);

  useEffect(() => {
    switch (action) {
      case StrategyInteraction.DEPOSIT:
        setFromToken(null);
        setToToken(selectedStrategy);
        break;
      case StrategyInteraction.WITHDRAW:
        setFromToken(selectedStrategy);
        setToToken(selectedStrategy?.asset);
        break;
      default:
        break;
    }
  }, [action, selectedStrategy]);

  const switchSelectMode = useCallback(() => {
    setSelectTokenMode(!selectTokenMode);
  }, [selectTokenMode]);

  useEffect(() => {
    if (!fromToken) {
      const token = tokenBySlug[sortedBalances?.[0]?.slug] ?? null;
      selectFromToken(token);
    }
  }, [
    fromToken,
    selectedStrategy,
    sortedBalances,
    action,
    toToken,
    selectFromToken,
  ]);

  const actionNeedToSwap = useMemo(() => {
    if (!fromToken || !toToken) return false;
    return !tokensIsEqual(fromToken, toToken);
  }, [fromToken, toToken]);

  return (
    <SwapContext.Provider
      value={{
        switchSelectMode,
        selectFromToken,
        selectToToken,
        setCanSwap: useCallback((value: boolean) => setCanSwap(value), []),
        setAction: useCallback((mode: StrategyInteraction) => {
          setAction(mode);
        }, []),
        setFromValue: useCallback(
          (value: number) => setFromValue(value ?? 0),
          []
        ),
        fromToken,
        toToken,
        fromValue,
        action,
        canSwap,
        selectTokenMode,
        actionNeedToSwap,
      }}
    >
      <EstimationProvider>{children}</EstimationProvider>
    </SwapContext.Provider>
  );
};

interface SwapContextType {
  switchSelectMode: () => void;
  selectFromToken: (token: Token | Strategy) => void;
  selectToToken: (token: Token | Strategy) => void;
  setAction: (mode: StrategyInteraction) => void;
  setCanSwap: (value: boolean) => void;
  setFromValue: (value: number) => void;
  fromToken: Token | Strategy;
  toToken: Token | Strategy;
  fromValue: number;
  action: StrategyInteraction;
  canSwap: boolean;
  selectTokenMode: boolean;
  actionNeedToSwap: boolean;
}

export { SwapContext, SwapProvider };
