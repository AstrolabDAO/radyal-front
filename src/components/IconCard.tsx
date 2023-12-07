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
        "h-8 w-8 translate-y-4 -ml-6": small,
        "mb-3": !small,
      })}
    >
      <div
        className={clsx({
          "w-10 h-10": !small,
          "w-8 h-8 border-none ": small,
        })}
      >
        <img src={icon.url} alt={icon.alt} className="centerXY" />
      </div>
    </div>
  );
};
export default IconCard;
