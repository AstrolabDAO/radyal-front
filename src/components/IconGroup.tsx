import { Logo } from "~/utils/interfaces";
import IconCard from "./IconCard";

const IconGroup = ({ icons }: { icons: Logo[] }) => {
  return (
    <div className="avatar-group -space-x-6 rtl:space-x-reverse">
      {icons.map((logo) => (
        <IconCard logo={logo} />
      ))}
    </div>
  );
};
export default IconGroup;
