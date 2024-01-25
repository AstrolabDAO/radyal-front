import axios from "axios";
import { LIFI_API } from "../constants";

export const getLiFiTransactionStatus = async (transactionHash: string) => {
  const result = await axios.get(`${LIFI_API}/status`, {
    params: {
      txHash: transactionHash,
    },
  });
  return result.data;
};
