import React, { createContext, useState } from "react";
import { BaseModal } from "~/components/Modal";

export interface ModalContextType {
  visible: boolean;
  selectedModal?: BaseModal;
  openModal: (modal: BaseModal) => void;
  closeModal: () => void;
}
interface ModalContextProps {
  children: BaseModal;
}
export const ModalContext = createContext<ModalContextType>({
  visible: false,
  selectedModal: null,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }: ModalContextProps) => {
  const [visible, setVisible] = useState(false);
  const Provider = ModalContext.Provider;
  const [modals, setModals] = useState<React.ReactElement[]>([]); // [modal1, modal2, modal3

  const [selectedModal, setSelectedModal] = useState<number>();

  const openModal = (modal: BaseModal) => {
    setModals([...modals, modal]);
    setSelectedModal(modals.length);
    setVisible(true);
  };
  const closeModal = () => {
    setModals(modals.slice(0, modals.length - 1));

    if (modals.length === 1) {
      setSelectedModal(null);
      setVisible(false);
    } else {
      setSelectedModal(modals.length - 2);
    }
  };
  return (
    <Provider
      value={{
        visible,
        openModal,
        closeModal,
        selectedModal: modals[selectedModal],
      }}
    >
      {children}
    </Provider>
  );
};
