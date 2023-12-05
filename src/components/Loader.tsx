import { HTMLAttributes, useEffect, useState } from "react";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  promise?: Promise<any> | null;
  state?: any;
  children?: React.ReactNode;
  blur?: boolean;
}
const Loader = ({ promise, children, state,blur = false }: LoaderProps) => {
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

  if (!isLoading && !children) return null;

  if(blur){
    return <>
    <div className="relative">{children}</div>
    </>
  }
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
