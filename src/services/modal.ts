import { getStoreState } from "~/store";

export const getModalState = () => getStoreState().modal;

export const getRender = () => getModalState().render;
export const getVisible = () => getModalState().visible;
export const getModals = () => getModalState().list;

export const selectedModal = () => {
  const modals = getModals();
  return modals[getModalState().selectedModal];
};
