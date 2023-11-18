const IconCard = ({ logo }) => {
  return (
    <div className="avatar">
      <div className="w-12">
        <img src={logo.url} alt={logo.alt} />
      </div>
    </div>
  );
};
export default IconCard;
