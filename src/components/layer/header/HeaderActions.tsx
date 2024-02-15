import clsx from "clsx";

import { useOperations } from "~/hooks/operation";

import Bell from "~/assets/icons/bell.svg?react";

import { OperationStatus } from "@astrolabs/swapper";
import { useMemo } from "react";
import { openModal } from "~/services/modal";
import { Button } from "~/components/styled";

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
    <Button
      outline={true}
      onClick={() =>
        openModal({
          modal: "notifications",
          title: "Notifications",
          size: operations?.length ? "big" : "small",
        })
      }
      className={clsx(
        "me-3 border-darkgrey relative",
        pendingOperations.length > 0 && "active"
      )}
    >
      {pendingOperations.length > 0 && (
        <div className="notification-badge">{pendingOperations.length}</div>
      )}
      <div className="w-4 h-4 flex">
        <Bell
          className={clsx("fill-primary bell-icon border-darkgrey", {
            "fill-primary": pendingOperations.length > 0,
            "fill-secondary": pendingOperations.length === 0,
          })}
        />
      </div>
    </Button>
  );
};

export default Dropdown;
