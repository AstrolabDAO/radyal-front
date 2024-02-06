import clsx from "clsx";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOperations } from "~/hooks/store/operation";

import { Operation } from "~/model/operation";

import Bell from "~/assets/icons/bell.svg?react";
import Close from "~/assets/icons/close.svg?react";
import NotificationTokenPresentation from "../../notification/NotificationTokenPresentation";

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const operations: Operation[] = useOperations();

  const notificationsArray = useMemo(
    () =>
      operations.map((operation: Operation): any => {
        return {
          id: operation.id,
          status: operation.status,
          toToken: operation.toToken,
          fromToken: operation.fromToken,
        };
      }),
    [operations]
  );
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (isOpen) {
      dropdownRef.current.focus();
    }
  }, [isOpen]);
  return (
    <div
      className={clsx(
        "action-wrapper group",
        notificationsArray.length > 0 && "active"
      )}
    >
      {notificationsArray.length > 0 && (
        <div className="notification-badge">{notificationsArray.length}</div>
      )}
      <Bell className="fill-white w-4 h-4 bell-icon" onClick={toggleDropdown} />
      <div
        ref={dropdownRef}
        tabIndex={-1}
        onBlur={() => setIsOpen(false)}
        className={clsx(
          "action-dropdown gap-3 flex flex-col focus:outline-none",
          isOpen ? "" : "hidden"
        )}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <div className="text-2xl font-bold gilroy">NOTIFICATIONS</div>
          <div className="w-4 h-4">
            <Close
              onClick={() => setIsOpen(false)}
              className="fill-white hover:fill-primary cursor-pointer"
            />
          </div>
        </div>
        {notificationsArray.map((operation) => {
          return (
            <NotificationTokenPresentation
              operation={operation}
              status={operation.status}
              key={`notification-${operation.id}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
