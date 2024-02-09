import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BaseModal } from "~/components/Modal";
import ActionModal from "~/components/modals/ActionModal";
import { Modals } from "~/utils/constants";

export interface StoredModal {
  modal: keyof typeof Modals;
  props?: object;
}

interface ModalState {
  visible: boolean;
  render: boolean;
  list: StoredModal[];
  selectedModal: number;
}
const initialState: ModalState = {
  visible: false,
  render: false,
  list: [],
  selectedModal: 0,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<StoredModal>) => {
      state.list.push(action.payload);
      state.selectedModal = state.list.length - 1;
      state.visible = true;
    },
    setRender: (state, action: PayloadAction<boolean>) => {
      state.render = action.payload;
    },
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    closeModal: (state) => {
      state.list = state.list.slice(0, state.list.length - 1);

      if (state.list.length === 0) {
        state.visible = false;
        state.selectedModal = null;
      } else {
        state.selectedModal = state.list.length - 1;
      }
    },
  },
});

export const { openModal, closeModal, setRender, setVisible } =
  modalSlice.actions;
export const ModalReducer = modalSlice.reducer;
