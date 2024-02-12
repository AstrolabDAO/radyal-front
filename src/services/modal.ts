import { getStore, getStoreState } from "~/store";
import { StoredModal, setRender, open, close } from "~/store/modal";

export const getModalState = () => getStoreState().modal;

export const getRender = () => getModalState().render;
export const getVisible = () => getModalState().visible;
export const getModals = () => getModalState().list;

export const selectedModal = () => {
  const modals = getModals();
  return modals[getModalState().selectedModal];
};

export const openModal = (modal: StoredModal) => {
  const store = getStore();
  store.dispatch(setRender(true));
  setTimeout(() => {
    store.dispatch(open(modal));
  }, 300);
};

export const closeModal = () => {
  const store = getStore();
  const modals = getModals();
  store.dispatch(close());
  if (modals.length === 0) {
    setTimeout(() => {
      store.dispatch(setRender(false));
    }, 300);
    return;
  }
};
