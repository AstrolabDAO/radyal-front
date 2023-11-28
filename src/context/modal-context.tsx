import React, { createContext, useState } from "react";

interface ModalContextType {
  visible: boolean;
  modalContent?: React.ReactNode;
  openModal: (modal: React.ReactNode) => void;
  closeModal: () => void;
}
interface ModalContextProps {
  children: React.ReactNode;
}
export const ModalContext = createContext<ModalContextType>({
  visible: false,
  modalContent: null,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }: ModalContextProps) => {
  const [visible, setVisible] = useState(false);
  const Provider = ModalContext.Provider;
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const openModal = (modal: React.ReactNode) => {
    setModalContent(modal);
    setVisible(true);
  };
  const closeModal = () => {
    setModalContent(null);
    setVisible(false);
  };
  return (
    <Provider value={{ visible, openModal, closeModal, modalContent }}>
      {children}
    </Provider>
  );
};
