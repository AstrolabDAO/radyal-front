import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useContext, useRef } from "react";
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
  const { visible, closeModal, selectedModal } = useContext(ModalContext);

  const onClose = useCallback(() => {
    if (selectedModal) {
      const { props } = selectedModal;

      if (props?.onClose) props.onClose();
    }
    closeModal();
  }, [selectedModal, closeModal]);

  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog
        open={visible}
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-base-half-transparent bg-opacity-75 transition-opacity backdrop-blur-medium"
            onClick={onClose}
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-y-auto rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-auto max-h-80vh backdrop-blur-strong bg-base-dark-transparent">
                <div className="relative z-50">
                  <button
                    className="right-0 top-0 absolute p-2 z-50"
                    onClick={onClose}
                  >
                    <FaTimes />
                  </button>
                  {selectedModal}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
