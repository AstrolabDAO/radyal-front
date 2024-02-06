import { ICommonStep, OperationStatus } from "@astrolabs/swapper";
import { Operation } from "~/model/operation";

export interface LiFITransactionStatusResponse {
  transactionId: string;
  sending: TransactionDetail;
  receiving: TransactionDetail;
  lifiExplorerLink: string;
  fromAddress: string;
  toAddress: string;
  tool: string;
  status: string;
  substatus: string;
  substatusMessage: string;
  metadata: Metadata;
  bridgeExplorerLink: string;
}

interface TransactionDetail {
  txHash: string;
  txLink: string;
  amount: string;
  token: Token;
  chainId: number;
  gasPrice: string;
  gasUsed: string;
  gasToken: GasToken;
  gasAmount: string;
  gasAmountUSD: string;
  amountUSD: string;
  timestamp: number;
}

interface Token {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

interface GasToken {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

interface Metadata {
  integrator: string;
}

export interface OperationStep
  extends Omit<ICommonStep, "fromToken" | "toToken"> {
  date?: number;
  status: OperationStatus;
  via: string;
  substatusMessage?: string;
  fromToken: Token;
  toToken: Token;
}

export interface EmmitStepAction {
  operationId: string;
  promise?: Promise<any>;
}
export interface UpdateAction {
  id: string;
  payload: Partial<Operation>;
}
