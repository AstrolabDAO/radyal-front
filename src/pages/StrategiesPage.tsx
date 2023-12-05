import Strategies from "~/components/Strategies";
import { StrategyProvider } from "~/context/strategy-context";
import { SwapModalProvider } from "~/context/swap-modal-context";

const StrategiesPage = () => {
  return (
    <StrategyProvider>
      <SwapModalProvider>
        <h1 className="text-center text-4xl mb-6 md:text-6xl mb-10 title text-primary">
          Welcome on Radyal
        </h1>
        <Strategies />
      </SwapModalProvider>
    </StrategyProvider>
  );
};
export default StrategiesPage;
