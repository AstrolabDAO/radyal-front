import { createSlice } from "@reduxjs/toolkit";
import { NetworkInterface } from "~/model/network";
import { ProtocolInterface } from "~/model/protocol";
import { fetchNetworks, fetchProtocols } from "./api/astrolab";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

export interface Web3State {
  loading: {
    networks: boolean;
    protocols: boolean;
    wagmiConfig: boolean;
  };
  config: {
    modal: ReturnType<typeof createWeb3Modal>;
    wagmiConfig: ReturnType<typeof defaultWagmiConfig>;
  };
  protocols: ProtocolInterface[];
  networks: NetworkInterface[];
}

const initialState: Web3State = {
  loading: {
    networks: true,
    protocols: true,
    wagmiConfig: true,
  },
  config: {
    modal: null,
    wagmiConfig: null,
  },
  networks: [],
  protocols: [],
};

const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setNetworks(state, action) {
      state.networks = action.payload;
    },
    setConfig(state, action) {
      state.config = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNetworks.pending, (state) => {
      state.loading.networks = true;
    });
    builder.addCase(fetchNetworks.fulfilled, (state, action) => {
      state.loading.networks = false;
      state.networks = action.payload.networks;
      state.config.wagmiConfig = action.payload.config.config;
      state.config.modal = action.payload.config.web3Modal;
    });

    builder.addCase(fetchProtocols.pending, (state) => {
      state.loading.protocols = true;
    });
    builder.addCase(fetchProtocols.fulfilled, (state, action) => {
      state.loading.protocols = false;
      state.protocols = action.payload;
    });
  },
});

export const { setNetworks, setConfig } = web3Slice.actions;

export const Web3Reducer = web3Slice.reducer;
