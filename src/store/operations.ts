import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  EmmitStepAction,
  IOperation,
  OperationStatus,
  UpdateAction,
} from "~/model/operation";
import LocalStorageService from "~/services/localStorage";
import { cacheHash } from "~/utils/format";

export const CACHE_KEY = cacheHash("operations");

export interface OperationsState {
  list: IOperation[];
  intervalId: NodeJS.Timeout;
  selectedOperationIndex: number;
  byId: { [id: string]: IOperation };
  byHash: { [hash: string]: IOperation };
  byStatus: { [status: string]: IOperation[] };
  indexById: { [id: string]: number };
}

const updateMappings = (state: OperationsState) => {
  state.byId = {};
  state.byHash = {};
  state.indexById = {};
  state.byStatus = {};
  state.byStatus = {};

  state.list.forEach((operation, index) => {
    state.byId[operation.id] = operation;
    if (operation.txHash) state.byHash[operation.txHash] = operation;
    state.indexById[operation.id] = index;
    if (!state.byStatus[operation.status])
      state.byStatus[operation.status] = [];
    state.byStatus[operation.status].push(operation);
  });
};

const initialState: OperationsState = {
  list: LocalStorageService.getItem(CACHE_KEY) ?? [],
  selectedOperationIndex: 0,
  intervalId: null,
  byId: {},
  byHash: {},
  indexById: {},
  byStatus: {},
};

updateMappings(initialState);

const operationSlice = createSlice({
  name: "operations",
  initialState,
  reducers: {
    add(state, action: PayloadAction<IOperation>) {
      state.list.push({ ...action.payload, isStored: true });
      state.selectedOperationIndex = state.list.length - 1;
    },
    update: (state, action: PayloadAction<UpdateAction>) => {
      const index = state.indexById[action.payload.id];
      const { payload } = Object.assign({}, action.payload);

      const tx = state.list[index];

      if (!tx) return;
      state.list[index] = {
        ...tx,
        ...payload,
      };
    },
    updateIntervalId: (
      state,
      action: PayloadAction<{ intervalId: NodeJS.Timeout }>
    ) => {
      state.intervalId = action.payload.intervalId;
    },
    deleteOperation: (state, action: PayloadAction<string>) => {
      const index = state.indexById[action.payload];
      state.list.splice(index, 1);
    },
    selectOperation: (state, action: PayloadAction<string>) => {
      state.selectedOperationIndex = state.indexById[action.payload];
    },
    emmitStep: (state, action: PayloadAction<EmmitStepAction>) => {
      const { operationId, txHash } = action.payload;

      const operationIndex = state.indexById[operationId];
      const operation = state.list[operationIndex];

      if (!operation) return;

      const currentStep =
        operation.steps.filter(
          ({ status }) =>
            status !== OperationStatus.DONE && status !== OperationStatus.FAILED
        )[0] ?? null;
      if (!currentStep) return;
      if (txHash) currentStep.txHash = txHash;

      currentStep.status = OperationStatus.DONE;
      currentStep.date = new Date().getTime();
      LocalStorageService.setItem(
        CACHE_KEY,
        state.list,
        1000 * 60 * 60 * 24 * 30 // 1 month
      );
    },
    failCurrentStep: (state, action: PayloadAction<string>) => {
      const operationIndex = state.indexById[action.payload];
      const operation = state.list[operationIndex];

      if (!operation) return;

      const currentStep =
        operation.steps.filter(
          ({ status }) =>
            status !== OperationStatus.DONE && status !== OperationStatus.FAILED
        )[0] ?? null;
      if (!currentStep) return;
      currentStep.status = OperationStatus.FAILED;
    },
    updateMappings,
  },
});

export const {
  add,
  update,
  deleteOperation,
  emmitStep,
  failCurrentStep,
  selectOperation,
  updateIntervalId,
} = operationSlice.actions;

export const OperationReducer = operationSlice.reducer;
