import Lottie from "lottie-react";
import { HTMLAttributes, useEffect, useState } from "react";

import logo from "~/assets/animations/logo.json";
interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  value?: Promise<any> | null | any;
  children?: React.ReactNode;
  loaderClasses?: string;
  title?: string;
}
const Loader = ({
  width,
  children,
  loaderClasses,
  value = null,
  title = null,
  ...props
}: LoaderProps) => {
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
        <div {...props}>
          <Lottie animationData={logo} className={loaderClasses} />
          <p className="text-center">{title}</p>
        </div>
      )}
      {!isLoading && <>{children}</>}
    </>
  );
};
export default Loader;
