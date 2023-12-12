import { HTMLAttributes, useEffect, useState } from "react";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  value?: Promise<any> | null | any;
  children?: React.ReactNode;
}
const Loader = ({ children, value = null }: LoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!value) {
      setIsLoading(true);
      return;
    }

    if (typeof value?.then === "function") {
      value
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    } else {
      if (value !== null) {
        setIsLoading(false);
      }
    }
  }, [value]);

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
