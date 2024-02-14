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
        className="text-gray-400 hover:text-white cursor-pointer flex-row flex"
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
        <div className="text-gray-400 hover:text-white cursor-pointer">
          METRICS
        </div>
        <a
          href="https://docs.astrolab.fi/"
          className="text-gray-400 hover:text-white"
        >
          DOCS
        </a>
        <div className="text-gray-400 hover:text-white cursor-pointer">
          AUDITS
        </div>
      </StyledDropdown>
    </div>
  );
};

export default HeaderAbout;
