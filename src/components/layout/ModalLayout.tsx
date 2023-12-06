const ModalLayout = ({ children, title, actions }: ModalLayoutProps) => {
  return (
    <div className="block">
      {title && <h1 className="text-center mb-8">{title} </h1>}

      <div className="box w-full">{children}</div>
      {actions && (
        <div className="py-3 sm:flex sm:flex-row-reverse">
          <div className="flex w-full justify-center">
            {actions.map(({ label, onClick }, index) => (
              <button
                key={label + index}
                className="btn btn-primary w-full"
                onClick={onClick}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ModalAction {
  label: string;
  onClick: () => void;
}
interface ModalLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: ModalAction[];
}

export default ModalLayout;
