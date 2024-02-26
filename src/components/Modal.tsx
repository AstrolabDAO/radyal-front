import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useMemo } from "react";
import {
  useModals,
  useRender,
  useSelectedModal,
  useVisible,
} from "~/hooks/modal";

import clsx from "clsx";
import ChevronLeft from "~/assets/icons/chevron-left.svg?react";
import Close from "~/assets/icons/close.svg?react";
import { closeModal } from "~/services/modal";
import { Modals } from "~/utils/constants";

import { ModalWrapper } from "./styled";

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
  const selectedModal = useSelectedModal();
  const modals = useModals();
  const size = useMemo(() => {
    if (!selectedModal) return "small";
    return selectedModal?.size;
  }, [selectedModal]);

  const onClose = useCallback(() => {
    closeModal();
  }, [selectedModal]);
  if (!render) return null;

  const ModalComponent = Modals[selectedModal?.modal];

  return (
    <Transition
      show={visible}
      as={Dialog}
      onClose={onClose}
      className="z-30 relative"
    >
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
          <Dialog.Panel
            className={clsx("dialog w-full relative overflow-visible", size)}
          >
            <ModalWrapper
              className={clsx("max-h-90vh", {
                "overflow-visible": selectedModal?.modal === "select-token",
                "overflow-y-auto": selectedModal?.modal !== "select-token",
              })}
            >
              {selectedModal?.showTitle && (
                <div className="flex w-full mb-4">
                  {modals.length === 1 && <div></div>}
                  {modals.length > 1 && (
                    <div className="flex flex-row items-center">
                      <ChevronLeft
                        className="cursor-pointer fill-base-content hover:fill-primary h-5"
                        onClick={closeModal}
                      />
                    </div>
                  )}
                  <div className="flex-grow text-center font-bold text-3xl uppercase text-white gilroy flex-3">
                    {selectedModal?.title}
                  </div>

                  <div
                    className="z-30 rounded-tr-xl text-white"
                    onClick={onClose}
                  >
                    <Close className="h-6 fill-base-content hover:fill-primary" />
                  </div>
                </div>
              )}
              {selectedModal && <ModalComponent {...selectedModal?.props} />}
            </ModalWrapper>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Modal;
