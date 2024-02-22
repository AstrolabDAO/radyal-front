import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NetworksResponse, ProtocolsResponse } from "~/interfaces/astrolab-api";
import { formatNetworks, formatProtocols } from "~/utils/api";
import { NETWORKS } from "~/utils/web3-constants";

export const initStore = (store) => {
  Promise.all([
    store.dispatch(fetchNetworks()),
    store.dispatch(fetchProtocols()),
  ]).then(() => {
    //store.dispatch(fetchStrategies());
  });
};

export const fetchNetworks = createAsyncThunk(
  "astrolab/fetchNetworks",
  async (arg, { rejectWithValue }) => {
    try {
      const result = await axios.get<NetworksResponse>(
        `${process.env.ASTROLAB_API}/networks?slugs=${JSON.stringify(NETWORKS)}`
      );
      return formatNetworks(result.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProtocols = createAsyncThunk(
  "astrolab/fetchProtocols",
  async (arg, { rejectWithValue }) => {
    try {
      const result = await axios.get<ProtocolsResponse>(
        `${process.env.ASTROLAB_API}/protocols`
      );
      return formatProtocols(result.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
/*
export const fetchStrategies = createAsyncThunk(
  "astrolab/fetchStrategies",
  async (arg, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${process.env.ASTROLAB_API}/strategies`);
      return formatStrategies(result.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
*/
