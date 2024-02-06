import { useCloseModal } from "~/hooks/store/modal";
import { useOperations } from "~/hooks/store/operation";
import NotificationTokenPresentation from "../notification/NotificationTokenPresentation";
export const NotificationsModal = () => {
  const operations = useOperations();
  const closeModal = useCloseModal();
  return (
    <div className="modal-wrapper">
      <div className="text-3xl text-white uppercase font-bold gilroy my-auto text-center">
        NOTIFICATIONS
      </div>
      <div>
        {operations.map((operation) => {
          return (
            <NotificationTokenPresentation
              operation={operation}
              key={`notification-${operation.id}`}
            />
          );
        })}
      </div>
    </div>
  );
};
