import clsx from "clsx";

import { useEffect, useRef, useState } from "react";
import ChevronDown from "~/assets/icons/chevron-down.svg?react";
import Dropdown from "./HeaderActions";
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
        onClick={toggleDropdown}
        className="hover:text-white cursor-pointer flex-row flex"
      >
        ABOUT
        <div className="h-4 w-4 flex items-center my-auto ms-1">
          <ChevronDown className="flex my-auto" />
        </div>
      </div>
      <StyledDropdown
        visible={isOpen}
        ref={dropdownRef}
        tabIndex={-1}
        onBlur={onBlur}
      >
        <a href="#" className="hover:text-white cursor-pointer">
          METRICS
        </a>
        <a href="https://docs.astrolab.fi/" className=" hover:text-white">
          DOCS
        </a>
        <a href="#" className=" hover:text-white cursor-pointer">
          AUDITS
        </a>
      </StyledDropdown>
    </div>
  );
};

export default HeaderAbout;
