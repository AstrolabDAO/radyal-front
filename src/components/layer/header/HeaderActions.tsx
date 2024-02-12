import clsx from "clsx";

import { useOperations } from "~/hooks/operation";

import Bell from "~/assets/icons/bell.svg?react";

import { OperationStatus } from "@astrolabs/swapper";
import { useMemo } from "react";
import { openModal } from "~/services/modal";

const Dropdown: React.FC = () => {
  const operations = useOperations();

  const pendingOperations = useMemo(
    () =>
      operations.filter(
        (operation) => operation.status === OperationStatus.PENDING
      ),
    [operations]
  );

  return (
    <div
      onClick={() => openModal({ modal: "notifications", size: "big" })}
      className={clsx(
        "action-wrapper group",
        pendingOperations.length > 0 && "active"
      )}
    >
      {pendingOperations.length > 0 && (
        <div className="notification-badge">{pendingOperations.length}</div>
      )}
      <div className="w-4 h-4 flex">
        <Bell
          className={clsx("fill-primary bell-icon", {
            "fill-primary": pendingOperations.length > 0,
            "fill-secondary": pendingOperations.length === 0,
          })}
        />
      </div>
    </div>
  );
};

export default Dropdown;
