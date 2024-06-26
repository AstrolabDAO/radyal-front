import { useEffect, useRef, useState } from "react";
import ChevronDown from "~/assets/icons/down.svg?react";
import Link from "~/assets/icons/link.svg";
import { StyledDropdown } from "~/components/styled";

const HeaderAbout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const onBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      dropdownRef.current.focus();
    }
  }, [isOpen]);
  return (
    <div>
      <div
        onMouseEnter={toggleDropdown}
        className="hover:text-primary cursor-pointer flex-row flex font-medium"
      >
        ABOUT
        <div className="h-3 w-3 flex items-center my-auto ms-1">
          <ChevronDown className="flex my-auto" />
        </div>
      </div>
      <StyledDropdown
        className="absolute left-0 mt-2 min-w-40 bg-dark p-3 border-darkerGrey border-solid border-2 font-medium gilroy gap-1 cursor-default rounded-2xl flex-col"
        visible={isOpen}
        ref={dropdownRef}
        tabIndex={-1}
        onBlur={onBlur}
        onMouseLeave={toggleDropdown}
      >
        <a href="#" className="hover:text-primary cursor-pointer">
          METRICS
        </a>
        <a href="https://docs.astrolab.fi/" className=" hover:text-primary">
          DOCS&nbsp;
          <img className="invert w-4 inline" src={Link} alt="link" />
        </a>
        <a href="#" className=" hover:text-primary cursor-pointer">
          AUDITS&nbsp;
          <img className="invert w-4 inline" src={Link} alt="link" />
        </a>
      </StyledDropdown>
    </div>
  );
};

export default HeaderAbout;
