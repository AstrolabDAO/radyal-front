import { SwapModalProvider } from "~/context/swap-modal-context";
import { StrategyProvider } from "~/context/strategy-context";

import StrategyGrid from "~/components/strategy/StrategyGrid";
import StrategyHero from "~/components/strategy/StrategyHero";

const StrategiesPage = () => {
  return (
    <SwapModalProvider>
      <StrategyHero />
      <StrategyGrid />
    </SwapModalProvider>
  );
};
export default StrategiesPage;
