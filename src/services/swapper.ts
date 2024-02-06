import { getStoreState } from "~/store";

export const getSwapperStore = () => getStoreState().swapper;

export const getIsInit = () => getSwapperStore().is.init;
export const getIsSelection = () => getSwapperStore().is.selection;
export const getInteraction = () => getSwapperStore().interaction;
export const getFromToken = () => {
  const store = getSwapperStore();
  const interaction = store.interaction;
  return store[interaction].from;
};
export const getToToken = () => {
  const store = getSwapperStore();
  const interaction = store.interaction;
  return store[interaction].to;
};
