import React, { createContext, useState } from "react";

interface ModalContextType {
  visible: boolean;
  modalContent?: React.ReactNode;
  open: (modal: React.ReactNode) => void;
  close: () => void;
}
interface ModalContextProps {
  children: React.ReactNode;
}
export const ModalContext = createContext<ModalContextType>({
  visible: false,
  modalContent: null,
  open: () => {},
  close: () => {},
});

export const ModalProvider = ({ children }: ModalContextProps) => {
  const [visible, setVisible] = useState(false);
  const Provider = ModalContext.Provider;
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const open = (modal: React.ReactNode) => {
    setModalContent(modal);
    setVisible(true);
  };
  const close = () => {
    setModalContent(null);
    setVisible(false);
  };
  return (
    <Provider value={{ visible, open, close, modalContent }}>
      {children}
    </Provider>
  );
};
