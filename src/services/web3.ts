import { Config } from "wagmi";
import { getStoreState } from "~/store";
import {
  networksIsLoadingSelector,
  networksSelector,
  protocolsIsLoadingSelector,
  protocolsSelector,
  wagmiConfigSelector,
} from "~/store/selectors/web3";

export const getWeb3State = () => getStoreState().web3;

export const getNetworkIsLoding = () => {
  const state = getStoreState();
  return networksIsLoadingSelector(state);
};

export const getProtocolsIsLoading = () => {
  const state = getStoreState();
  return protocolsIsLoadingSelector(state);
};

export const getWagmiConfig = (): Config => {
  const state = getStoreState();
  return wagmiConfigSelector(state);
};

export const getNetworks = () => {
  const state = getStoreState();
  return networksSelector(state);
};

export const getProtocols = () => {
  const state = getStoreState();
  return protocolsSelector(state);
};
