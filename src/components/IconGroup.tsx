import { Icon } from "~/utils/interfaces";
import IconCard from "./IconCard";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
interface Props extends ButtonHTMLAttributes<HTMLDivElement> {
  icons?: Icon[];
}
const IconGroup = ({ icons, className, ...props }: Props) => {
  return (
    <div
      {...props}
      className={clsx(
        "avatar-group -space-x-6 rtl:space-x-reverse overflow-visible",
        className
      )}
    >
      {icons.map((icon) => (
        <IconCard key={icon.url} icon={icon} />
      ))}
    </div>
  );
};
export default IconGroup;
