import { ICommonStep } from "@astrolabs/swapper";
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

export interface OperationInterface {
  id: string;
  status: OperationStatus;
  txHash?: string;
  estimation: any;
  steps: OperationStep[];
  receivingTx?: string;
  sendingTx?: string;
  currentStep: number;
  substatus?: string;
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

export interface OperationStep extends ICommonStep {
  status: OperationStatus;
  via: string;
  substatusMessage?: string;
}

export interface EmmitStepAction {
  operationId: string;
  promise?: Promise<any>;
}
export interface UpdateAction {
  id: string;
  payload: Partial<Operation>;
}

export enum OperationStatus {
  WAITING = "WAITING",
  PENDING = "PENDING",
  DONE = "DONE",
  FAILED = "FAILED",
}
