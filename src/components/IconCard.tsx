import clsx from "clsx";
import { Icon } from "~/utils/interfaces";

interface IconCardProps {
  icon: Icon;
}
const IconCard = ({ icon }: IconCardProps) => {
  const { small, classes } = icon;

  return (
    <div
      className={clsx("avatar", classes, {
        "h-7 w-7 bottom-right-icon": small,
      })}
    >
      <div
        className={clsx({
          "w-8 h-8": !small,
          "w-7 h-7 border-none": small,
        })}
      >
        <img src={icon.url} alt={icon.alt} className="centerXY" />
      </div>
    </div>
  );
};
export default IconCard;
