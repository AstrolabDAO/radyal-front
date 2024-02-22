import { NotificationsModal } from "~/components/modals/NotificationsModal";
import SelectTokenModal from "~/components/modals/SelectTokenModal";
import ActionModal from "~/components/modals/ActionModal";
import ActionStepsModal from "~/components/modals/ActionStepsModal";

export const DeFI_API = "https://api.de.fi/v3";
export const COINGECKO_API = "https://api.coingecko.com/api/v3";
export const TOKEN_BASENAME_REGEX = /.*(USDC|BTC|ETH|USDT|FTM|BNB).*/gi;

export enum SelectTokenModalMode {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

export const Modals = {
  swap: ActionModal,
  steps: ActionStepsModal,
  notifications: NotificationsModal,
  "select-token": SelectTokenModal,
};
