import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import React from "react";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, primary = true, children, ...props }: Props, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(className, "btn", {
          "btn-primary": primary,
          "btn-secondary": !primary,
        })}
        {...props}
      >
        {children}
      </button>
    );
  }
);
export default Button;
