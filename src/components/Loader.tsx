import { HTMLAttributes, useEffect, useState } from "react";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  promise?: Promise<any> | null;
  state?: any;
  children: React.ReactNode;
}
const Loader = ({ promise, children, state }: LoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!promise && !state) return;

    if (promise) {
      promise
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    } else {
      if (state) {
        setIsLoading(false);
      }
    }
  }, [promise, state]);

  return (
    <>
      {isLoading && (
        <span className="loading loading-spinner loading-xs"></span>
      )}
      {!isLoading && <>{children}</>}
    </>
  );
};
export default Loader;
