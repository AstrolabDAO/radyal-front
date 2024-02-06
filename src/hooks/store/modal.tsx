import { Component, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { BaseModal } from "~/components/Modal";
import { getModals } from "~/services/modal";
import { IRootState } from "~/store";
import { StoredModal, closeModal, openModal, setRender } from "~/store/modal";

export const useOpenModal = () => {
  const dispatch = useDispatch();
  return useCallback(
    (modal: StoredModal) => {
      dispatch(setRender(true));
      setTimeout(() => {
        dispatch(openModal(modal));
      }, 300);
    },
    [dispatch]
  );
};

export const useCloseModal = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(closeModal(null));
    if (getModals().length === 0) {
      setTimeout(() => {
        dispatch(setRender(false));
      }, 300);
    }
  }, [dispatch]);
};

export const useRender = () => {
  return useSelector((state: IRootState) => state.modal.render);
};

export const useModals = () =>
  useSelector((state: IRootState) => state.modal.list);

export const useVisible = () => {
  return useSelector((state: IRootState) => state.modal.visible);
};

export const useSelectedModal = () => {
  return useSelector(
    (state: IRootState) => state.modal.list[state.modal.selectedModal]
  );
};
