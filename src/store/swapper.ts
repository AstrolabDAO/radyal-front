import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { OperationType } from "~/constants";
import { Estimation, Strategy, Token } from "~/utils/interfaces";
import {
  SetOnWritePayload,
  SwapperOperationDeposit,
  SwapperOperationWithdraw,
} from "./interfaces/swapper";

export interface SwapperState {
  debounceTimer: NodeJS.Timeout;
  hash: string;
  is: {
    init: boolean;
    selection: boolean;
    estimationOnprogress: boolean;
    estimationLocked: boolean;
    onWrite: boolean;
    locked: boolean;
  };
  deposit: SwapperOperationDeposit;
  withdraw: SwapperOperationWithdraw;
  interaction: OperationType;
}

const initialState: SwapperState = {
  debounceTimer: null,
  hash: null,
  is: {
    init: false,
    selection: false,
    estimationOnprogress: false,
    estimationLocked: false,
    onWrite: false,
    locked: false,
  },
  deposit: {
    from: null,
    to: null,
    value: null,
    estimatedRoute: null,
  },
  withdraw: {
    from: null,
    to: null,
    value: null,
    estimatedRoute: null,
  },
  interaction: OperationType.DEPOSIT,
};

export interface SelectTokenAction {
  token: Token | Strategy;
  for: "from" | "to";
  interaction?: OperationType;
}
const swapperSlice = createSlice({
  name: "swapper",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<Partial<SwapperState>>) => {
      state.hash = action.payload.hash;
      state.is.init = true;
      state.deposit = action.payload.deposit;
      state.withdraw = action.payload.withdraw;
      state.interaction = action.payload.interaction;
    },
    clearState: (state) => {
      Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value;
      });
    },
    switchSelection: (state) => {
      state.is.selection = !state.is.selection;
    },
    setInteraction: (state, payload: PayloadAction<OperationType>) => {
      state.interaction = payload.payload;
    },
    select: (state, action: PayloadAction<SelectTokenAction>) => {
      state[action.payload.interaction ?? state.interaction][
        action.payload.for
      ] = action.payload.token;
    },
    setFromValue: (state, action: PayloadAction<number>) => {
      state[state.interaction].value = action.payload;
    },
    setEstimationOnprogress: (state, action: PayloadAction<boolean>) => {
      state.is.estimationOnprogress = action.payload;
    },
    setInteractionEstimation: (state, action: PayloadAction<Estimation>) => {
      state[state.interaction].estimatedRoute = action.payload;
    },
    lockEstimation: (state) => {
      state.is.estimationLocked = true;
    },
    unlockEstimation: (state) => {
      state.is.estimationLocked = false;
    },
    setOnWrite: (state, action: PayloadAction<SetOnWritePayload>) => {
      state.is.onWrite = action.payload.onWrite;
      state.debounceTimer = action.payload.debounceTimer ?? null;
    },
    setHash: (state, action: PayloadAction<string>) => {
      state.hash = action.payload;
    },
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.is.locked = action.payload;
    },
    setEstimationIsLocked: (state, action: PayloadAction<boolean>) => {
      state.is.estimationLocked = action.payload;
    },
  },
});

export const {
  init,
  select,
  clearState,
  switchSelection,
  setInteraction,
  setFromValue,
  setEstimationOnprogress,
  setInteractionEstimation,
  setEstimationIsLocked,
  setOnWrite,
  setLocked,
  setHash,
  lockEstimation,
  unlockEstimation,
} = swapperSlice.actions;
export default swapperSlice.actions;
export const SwapperReducer = swapperSlice.reducer;
