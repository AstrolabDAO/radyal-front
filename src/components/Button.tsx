import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
}
const Button = ({ className, primary, children, ...props }: Props) => {
  return (
    <button
      className={clsx(className, "btn", { "btn-primary": primary })}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
