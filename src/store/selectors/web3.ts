import { createSelector } from "@reduxjs/toolkit";
import { IRootState } from "..";
import { Network } from "~/model/network";
import { Protocol } from "~/model/protocol";

export const networksIsLoadingSelector = createSelector(
  (state: IRootState) => state.web3,
  (web3) => web3.loading.networks
);

export const protocolsIsLoadingSelector = createSelector(
  (state: IRootState) => state.web3,
  (web3) => web3.loading.protocols
);
export const wagmiConfigSelector = createSelector(
  (state: IRootState) => state.web3,
  (web3) => web3.config.config
);

export const networksSelector = createSelector(
  (state: IRootState) => state.web3,
  (web3) => web3.networks.map((n) => new Network(n))
);

export const protocolsSelector = createSelector(
  (state: IRootState) => state.web3,
  (web3) => web3.protocols.map((p) => new Protocol(p))
);
