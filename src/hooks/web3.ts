import { useSelector } from "react-redux";
import {
  networksIsLoadingSelector,
  networksSelector,
  protocolsIsLoadingSelector,
  protocolsSelector,
  wagmiConfigSelector,
} from "~/store/selectors/web3";

export const useNetworksIsLoading = () =>
  useSelector(networksIsLoadingSelector);

export const useProtocolsIsLoading = () =>
  useSelector(protocolsIsLoadingSelector);

export const useWagmiConfig = () => useSelector(wagmiConfigSelector);

export const useNetworks = () => useSelector(networksSelector);

export const useProtocols = () => useSelector(protocolsSelector);
