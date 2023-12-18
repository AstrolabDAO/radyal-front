import { Icon } from "~/utils/interfaces";
import IconCard from "./IconCard";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
interface Props extends ButtonHTMLAttributes<HTMLDivElement> {
  icons?: Icon[];
}
const IconGroup = ({ icons, className, ...props }: Props, index) => {
  return (
    <div
      key={index}
      {...props}
      className={clsx("flex overflow-visible", className)}
    >
      {icons.map((icon) => (
        <IconCard key={icon.url} icon={icon} />
      ))}
    </div>
  );
};
export default IconGroup;
