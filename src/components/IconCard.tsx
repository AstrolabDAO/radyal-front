import clsx from "clsx";

interface IconCardProps {
  icon: {
    url: string;
    alt: string;
    small?: boolean;
  };
}
const IconCard = ({ icon }: IconCardProps) => {
  const { small } = icon;
  return (
    <div className={clsx("avatar", { "h-5 w-5 bottom-right-icon": small })}>
      <div
        className={clsx({
          "w-6": !small,
          "w-5 h-5 border-none": small,
        })}
      >
        <img src={icon.url} alt={icon.alt} className="centerXY" />
      </div>
    </div>
  );
};
export default IconCard;
