import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

import IconCard from "./IconCard";
import { Icon } from "~/utils/interfaces";

interface Props extends ButtonHTMLAttributes<HTMLDivElement> {
  icons?: Icon[];
}
const IconGroup = ({ icons, className, ...props }: Props) => {
  return (
    <div {...props} className={clsx("flex overflow-visible avatar-border-none", className)}>
      {icons.map((icon, index) => (
        <IconCard key={ index } icon={ icon } />
      ))}
    </div>
  );
};
export default IconGroup;
