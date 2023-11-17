import axios from "axios";

const BALANCE_API = "https://api.de.fi/v3";

export const walletBalancesByNetwork = async (
  address: `0x${string}`,
  chain: string
) => {
  return axios
    .get(
      `${BALANCE_API}/balances?addresses[]=${address.toLocaleLowerCase()}&chains[]=${chain}`
    )
    .then((res) => res.data.data);
};
