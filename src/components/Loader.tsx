import { HTMLAttributes, useEffect, useState } from "react";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  promise: Promise<any> | null;
  children: React.ReactNode;
}
const Loader = ({ promise, children }: LoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!promise) return;
    setIsLoading(true);

    promise
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  }, [promise]);

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
