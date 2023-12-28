import React, { createContext, useCallback, useState } from "react";
import { BaseModal } from "~/components/Modal";

export interface ModalContextType {
  visible: boolean;
  render: boolean;
  selectedModal?: BaseModal;
  openModal: (modal: BaseModal) => CallableFunction;
  closeModal: () => void;
}
interface ModalContextProps {
  children: BaseModal;
}
export const ModalContext = createContext<ModalContextType>({
  visible: false,
  render: false,
  selectedModal: null,
  openModal: () => () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }: ModalContextProps) => {
  const [visible, setVisible] = useState(false);
  const [render, setRender] = useState(false);
  const Provider = ModalContext.Provider;
  const [modals, setModals] = useState<React.ReactElement[]>([]); // [modal1, modal2, modal3

  const [selectedModal, setSelectedModal] = useState<number>();

  const closeModal = useCallback(
    (_modals?: any[]) => {
      const modalList = _modals ?? modals;
      setModals(modalList.slice(0, modalList.length - 1));
      if (modalList.length === 1) {
        setSelectedModal(null);
        setRender(false);
        setVisible(false);
      } else {
        setSelectedModal(modalList.length - 2);
      }
    },
    [modals]
  );

  const openModal = (modal: BaseModal) => {
    setModals([...modals, modal]);
    setSelectedModal(modals.length);
    setVisible(true);
    setTimeout(() => setRender(true), 300);
    return () => closeModal([...modals, modal]);
  };

  return (
    <Provider
      value={{
        visible,
        render,
        openModal,
        closeModal,
        selectedModal: modals[selectedModal],
      }}
    >
      {children}
    </Provider>
  );
};
