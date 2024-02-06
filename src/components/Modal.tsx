import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";
import {
  useCloseModal,
  useRender,
  useSelectedModal,
  useVisible,
} from "~/hooks/store/modal";

export interface BaseModal extends React.ReactElement {
  props: {
    onClose?: () => void;
  };
}
export interface BaseModalProps {
  onClose?: () => void;
}

const Modal = () => {
  const render = useRender();
  const visible = useVisible();
  const closeModal = useCloseModal();
  const selectedModal = useSelectedModal();
  const onClose = useCallback(() => {
    if (selectedModal) {
      const { props } = selectedModal;

      if (props?.onClose) props.onClose();
    }
    closeModal();
  }, [selectedModal, closeModal]);
  if (!render) return null;

  return (
    <Transition show={visible} as={Dialog} onClose={onClose}>
      <div className="transition-wrapper">
        <Transition.Child
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          as={Fragment}
        >
          <Dialog.Panel className="dialog">
            <button
              className="right-0 top-0 absolute p-2 z-50 rounded-tr-xl w-8 h-8 sm:hidden"
              onClick={onClose}
            >
              <svg fill="#C1C1C1" viewBox="0 0 16 16">
                <path
                  fill="#C1C1C1"
                  fillRule="evenodd"
                  d="M2.54 2.54a1 1 0 0 1 1.42 0L8 6.6l4.04-4.05a1 1 0 1 1 1.42 1.42L9.4 8l4.05 4.04a1 1 0 0 1-1.42 1.42L8 9.4l-4.04 4.05a1 1 0 0 1-1.42-1.42L6.6 8 2.54 3.96a1 1 0 0 1 0-1.42Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {selectedModal}
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Modal;
