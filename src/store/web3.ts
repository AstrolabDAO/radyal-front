import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Network, NetworkInterface } from "~/model/network";
import { IProtocol } from "~/model/protocol";
import { fetchNetworks, fetchProtocols } from "./api/astrolab";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { setupWeb3modal } from "~/utils/setup-web3modal";

type Web3ModalConfig = ReturnType<typeof setupWeb3modal>;
export interface Web3State {
  connectedAddress: `0x${string}`;
  loading: {
    networks: boolean;
    protocols: boolean;
    wagmiConfig: boolean;
  };
  config: Web3ModalConfig;
  protocols: IProtocol[];
  networks: NetworkInterface[];
}

const initialState: Web3State = {
  connectedAddress: null,
  loading: {
    networks: true,
    protocols: true,
    wagmiConfig: true,
  },
  config: {
    web3Modal: null,
    config: null,
  },
  networks: [],
  protocols: [],
};

const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setNetworks: (state, action: PayloadAction<NetworkInterface[]>) => {
      state.networks = action.payload;
      state.loading.networks = false;
    },
    setProtocols: (state, action: PayloadAction<IProtocol[]>) => {
      state.protocols = action.payload;
      state.loading.protocols = false;
    },
    setConfig: (state, action: PayloadAction<Web3ModalConfig>) => {
      const { web3Modal, config } = action.payload;
      state.config.web3Modal = web3Modal;
      state.config.config = config;
      state.loading.wagmiConfig = false;
    },
    setConnectedAddress: (state, action: PayloadAction<`0x${string}`>) => {
      state.connectedAddress = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchNetworks.pending, (state) => {
      state.loading.networks = true;
    });
    builder.addCase(fetchNetworks.fulfilled, (state, action) => {
      state.loading.networks = false;
      state.networks = action.payload;
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

export const { setNetworks, setConfig, setConnectedAddress, setProtocols } =
  web3Slice.actions;

export const Web3Reducer = web3Slice.reducer;
