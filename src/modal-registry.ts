import { NotificationsModal } from "~/components/modals/NotificationsModal";
import SelectTokenModal from "~/components/modals/SelectTokenModal";
import ActionModal from "~/components/modals/ActionModal";
import ActionStepsModal from "~/components/modals/ActionStepsModal";

export const Modals = {
  swap: ActionModal,
  steps: ActionStepsModal,
  notifications: NotificationsModal,
  "select-token": SelectTokenModal,
};
