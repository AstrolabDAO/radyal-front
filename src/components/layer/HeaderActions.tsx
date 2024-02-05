import clsx from 'clsx';

import { useCallback, useMemo, useState } from 'react';
import { useOperations } from '~/hooks/store/operation';

import { Operation } from '~/model/operation';

import Bell from '~/assets/icons/bell.svg?react';
import NotificationTokenPresentation from '../notification/NotificationTokenPresentation';

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const operations: Operation[] = useOperations();

  const mapOperation = useCallback((operation: Operation): any => {
    const { fromToken } = operation.steps[0];
    const { fromToken: toToken } = operation.steps[operation.steps.length - 1];
    return {
      id: operation.id,
      status: operation.status,
      toToken,
      fromToken,
    }
  }, []);

  const notificationsArray = useMemo(() => operations.map(mapOperation), [operations, mapOperation]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={
      clsx("action-wrapper group",
      notificationsArray.length > 0 && "active")
    }>
    { notificationsArray.length > 0 &&
      <div className="notification-badge">
        { notificationsArray.length }
      </div>
    }
      <Bell
        className="fill-white w-4 h-4 bell-icon"
        onClick={toggleDropdown}
      />
      { isOpen && (
        <div
          className="action-dropdown"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          { notificationsArray.map((operation) => {
            return (
              <NotificationTokenPresentation
                operation={operation}
                key={`notification-${operation.id}`}
              />)
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;