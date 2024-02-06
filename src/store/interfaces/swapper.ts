import { Estimation, Strategy, Token } from "~/utils/interfaces";

export interface SetOnWritePayload {
  onWrite: boolean;
  debounceTimer?: NodeJS.Timeout;
}

interface SwapperOperation {
  value: number;
  estimatedRoute: Estimation;
}
export interface SwapperOperationWithdraw extends SwapperOperation {
  from: Strategy;
  to: Token;
}
export interface SwapperOperationDeposit extends SwapperOperation {
  from: Token;
  to: Strategy;
}
