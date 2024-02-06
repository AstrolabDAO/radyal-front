import { OperationStatus } from "@astrolabs/swapper";
import { OperationStep } from "~/store/interfaces/operations";
import { Token } from "~/utils/interfaces";

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

  fromToken: Token;
  toToken: Token;
}

class Operation implements OperationInterface {
  id: string;
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
