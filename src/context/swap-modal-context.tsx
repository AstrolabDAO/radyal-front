import { createContext, useContext } from "react";
import Modal from "~/components/Modal";
import { ModalContext, ModalContextType, ModalProvider } from "./modal-context";
import { SwapProvider } from "./swap-context";

export const SwapModalContext = createContext<ModalContextType>({
  visible: false,
  render: false,
  selectedModal: null,
<<<<<<< HEAD
  openModal: () => () => {},
  closeModal: () => {},
=======
  openModal: () => { },
  closeModal: () => { },
>>>>>>> 2cc907b (feat: add modal animation)
});

export const SwapModalProvider = ({ children }) => {
  return (
    <ModalProvider>
      <SwapModalContextProxy>{children}</SwapModalContextProxy>
    </ModalProvider>
  );
};

const SwapModalContextProxy = ({ children }) => {
  const { selectedModal, openModal, closeModal, visible } =
    useContext(ModalContext);

  return (
    <SwapModalContext.Provider
      value={{ openModal, closeModal, visible, selectedModal, render: true }}
    >
      {visible && (
        <SwapProvider>
          <Modal />
        </SwapProvider>
      )}
      {!visible && <Modal />}
      {children}
    </SwapModalContext.Provider>
  );
};
