import { useSelector } from "react-redux";
import { IRootState } from "~/store";

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
