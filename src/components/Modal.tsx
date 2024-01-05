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
  const { render, closeModal, selectedModal } = useContext(ModalContext);

  const onClose = useCallback(() => {
    if (selectedModal) {
      const { props } = selectedModal;

      if (props?.onClose) props.onClose();
    }
    closeModal();
  }, [selectedModal, closeModal]);

  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={render} as={Fragment}>
      <Dialog
        open={render}
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
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
              enter="ease-out duration-600"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="transform overflow-y-auto overflow-x-hidden rounded-lg shadow-xl transition-all backdrop-blur-medium bg-base-dark-transparent">
                <div className="relative text-left z-50 max-h-screen w-screen lg:max-w-xl max-h-90">
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
