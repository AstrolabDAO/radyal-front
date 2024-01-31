import {
  OperationInterface,
  OperationStatus,
  OperationStep,
} from "~/store/interfaces/operations";

class Operation implements OperationInterface {
  id: string;
  status: OperationStatus;
  txHash?: string;
  estimation: any;
  steps: OperationStep[];
  currentStep: number;
  receivingTx?: string;
  sendingTx?: string;
  substatus?: string;
  substatusMessage?: string;

  constructor(tx: Partial<Operation>) {
    this.id = tx.id;
    this.status = tx.status ?? OperationStatus.WAITING;
    this.txHash = tx.txHash ?? null;
    this.estimation = tx.estimation ?? null;
    this.steps = tx.steps ?? [];
    this.currentStep = tx.currentStep ?? 0;
    this.receivingTx = tx.receivingTx ?? null;
    this.sendingTx = tx.sendingTx ?? null;
    this.substatus = tx.substatus ?? null;
    this.substatusMessage = tx.substatusMessage ?? null;
  }

  toObject(): Partial<Operation> {
    return Object.assign({}, this);
  }
}

export { Operation, OperationStatus };
