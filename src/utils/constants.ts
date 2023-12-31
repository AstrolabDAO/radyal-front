export const DeFI_API = "https://api.de.fi/v3";
export const COINGECKO_API = "https://api.coingecko.com/api/v3";
export const TOKEN_BASENAME_REGEX = /.*(USDC|BTC|ETH|USDT|FTM|BNB).*/gi;

export enum SwapMode {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  SWAP = "SWAP",
}

export enum SelectTokenModalMode {
  Deposit = "deposit",
  Withdraw = "withdraw",
}
