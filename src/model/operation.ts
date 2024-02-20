import { ICommonStep, OperationStatus } from "@astrolabs/swapper";
import { Token } from "~/utils/interfaces";

export interface TransactionDetail {
  txHash: string;
  txLink: string;
  amount: string;
  token: SwapperToken;
  chainId: number;
  gasPrice: string;
  gasUsed: string;
  gasToken: SwapperToken;
  gasAmount: string;
  gasAmountUSD: string;
  amountUSD: string;
  timestamp: number;
}

export interface SwapperToken {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

export interface OperationStep
  extends Omit<ICommonStep, "fromToken" | "toToken"> {
  date?: number;
  status?: OperationStatus;
  via?: string;
  substatusMessage?: string;
  fromToken?: Token;
  toToken?: Token;
}

export interface EmmitStepAction {
  operationId: string;
  promise?: Promise<any>;
}
export interface UpdateAction {
  id: string;
  payload: Partial<Operation>;
}

export interface IOperation {
  id: string;
  isStored: boolean;
  status: OperationStatus;
  txHash?: string;
  estimation: any;
  steps: OperationStep[];
  receivingTx?: string;
  sendingTx?: string;
  currentStep: number;
  substatus?: string;
  fromToken: Token;
  toToken: Token;
}

class Operation implements IOperation {
  id: string;
  isStored: boolean;
  date: number;
  status: OperationStatus;
  txHash?: string;
  estimation: any;
  steps: OperationStep[];
  currentStep: number;
  receivingTx?: string;
  sendingTx?: string;
  substatus?: string;
  substatusMessage?: string;
  fromToken: Token;
  toToken: Token;

  constructor(tx: Partial<Operation>) {
    this.id = tx.id;
    this.isStored = false;
    this.date = tx.date ?? new Date().getTime();
    this.status = tx.status ?? OperationStatus.WAITING;
    this.txHash = tx.txHash ?? null;
    this.estimation = tx.estimation ?? null;
    this.steps = tx.steps ?? [];
    this.currentStep = tx.currentStep ?? 0;
    this.receivingTx = tx.receivingTx ?? null;
    this.sendingTx = tx.sendingTx ?? null;
    this.substatus = tx.substatus ?? null;
    this.substatusMessage = tx.substatusMessage ?? null;
    this.fromToken = tx.fromToken ?? null;
    this.toToken = tx.toToken ?? null;
  }

  toObject(): Partial<Operation> {
    return Object.assign({}, this);
  }
  toString(): string {
    return JSON.stringify(this.toObject());
  }
}

export { Operation, OperationStatus };
