import Modal from "~/components/Modal";
import Strategies from "~/components/Strategies";
import { ModalProvider } from "~/context/modal-context";
import { StrategyProvider } from "~/context/strategy-context";

const StrategiesPage = () => {
  return (
    <StrategyProvider>
      <ModalProvider>
        <h1 className="text-center text-6xl mb-6 md:text-8xl mb-10">
          Welcome on Radyal
        </h1>
        <Strategies />
        <Modal />
      </ModalProvider>
    </StrategyProvider>
  );
};
export default StrategiesPage;
