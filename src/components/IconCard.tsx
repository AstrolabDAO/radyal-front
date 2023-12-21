import clsx from "clsx";
import { Icon } from "~/utils/interfaces";

interface IconCardProps {
  icon: Icon;
}
const IconCard = ({ icon }: IconCardProps) => {
  const { small, classes, size } = icon;

  return (
    <div
      className={clsx("avatar", classes, {
        "h-8 w-8 translate-y-4 -ml-6": small && !size,
      })}
    >
      <div
        style={{ width: size?.width, height: size?.height }}
        className={clsx({
          "w-10 h-10": !small && !size,
          "w-8 h-8 border-none ": small && !size,
        })}
      >
        <img src={icon.url} alt={icon.alt} />
      </div>
    </div>
  );
};
export default IconCard;
