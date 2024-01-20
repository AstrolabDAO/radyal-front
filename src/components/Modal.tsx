import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { ModalContext } from "~/context/modal-context";

export interface BaseModal extends React.ReactElement {
  props: {
    onClose?: () => void;
  };
}
export interface BaseModalProps {
  onClose?: () => void;
}

const Modal = () => {
  const { render: isOpen, closeModal, selectedModal } = useContext(ModalContext);

  const onClose = useCallback(() => {
    if (selectedModal) {
      const { props } = selectedModal;

      if (props?.onClose) props.onClose();
    }
    closeModal();
  }, [selectedModal, closeModal]);

  return (
    <Transition show={ isOpen } as={ Dialog } onClose={ onClose }>
      <div className="flex items-center justify-center min-h-screen fixed inset-0 z-20 backdrop-blur-medium">
        <Transition.Child
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          as={ Fragment }
        >
          <Dialog.Panel className="overflow-x-hidden bg-dark rounded-xl max-h-screen w-screen sm:max-w-lg overflow-y-auto transition-all duration-300">
            <button
              className="right-0 top-0 absolute p-2 z-50 rounded-tr-xl"
              onClick={ onClose }
            >
              <FaTimes />
            </button>
            { selectedModal }
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Modal;
