import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";
import {
  useCloseModal,
  useRender,
  useSelectedModal,
  useVisible,
} from "~/hooks/store/modal";

import Close from "~/assets/icons/close.svg?react";

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
          <Dialog.Panel className="dialog max-h-screen sm-max-h-95vh">
            <button
              className="right-0 top-0 absolute p-2 z-50 rounded-tr-xl w-8 h-8 sm:hidden"
              onClick={onClose}
            >
              <Close className="fill-[#1C1C1C]" />
            </button>
            { selectedModal }
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Modal;
