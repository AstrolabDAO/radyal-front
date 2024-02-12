import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Modals } from "~/utils/constants";

export interface StoredModal {
  modal: keyof typeof Modals;
  props?: object;
  size?: "small" | "big" | "verybig";
}

export const ModalSizeConverter = {
  small: "sm",
  big: "lg",
  verybig: "xl",
};

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
    open: (state, action: PayloadAction<StoredModal>) => {
      if (!action.payload.size) action.payload.size = "small";
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
    close: (state) => {
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

export const { open, close, setRender, setVisible } = modalSlice.actions;
export const ModalReducer = modalSlice.reducer;
