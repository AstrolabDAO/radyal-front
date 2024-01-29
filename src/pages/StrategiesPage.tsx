import { StrategyProvider } from "~/context/strategy-context";
import { SwapModalProvider } from "~/context/swap-modal-context";

import StrategyGrid from "~/components/strategy/StrategyGrid";
import StrategyHero from "~/components/strategy/StrategyHero";

const StrategiesPage = () => {
  return (
    <StrategyProvider>
      <SwapModalProvider>
        <StrategyHero />
        <StrategyGrid />
      </SwapModalProvider>
    </StrategyProvider>
  );
};
export default StrategiesPage;
