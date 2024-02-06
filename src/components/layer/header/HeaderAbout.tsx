import clsx from 'clsx';

import {  useEffect, useRef, useState } from 'react';

const HeaderAbout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (isOpen) {
      dropdownRef.current.focus();
    }
  }, [isOpen]);
  return (
    <div>
      <div onClick={toggleDropdown} className='text-gray-400 hover:text-white cursor-pointer'>
        ABOUT
      </div>
      <div
        ref={dropdownRef}
        tabIndex={-1}
        onBlur={() => setIsOpen(false)}
        className={clsx("action-dropdown gap-3 flex flex-col w-40 gilroy font-semibold focus:outline-none",
          isOpen ? "" : "hidden"
        )}
      >
        <div className="text-gray-400 hover:text-white cursor-pointer">METRICS</div>
        <div className="text-gray-400 hover:text-white cursor-pointer">DOCS</div>
        <div className="text-gray-400 hover:text-white cursor-pointer">AUDITS</div>
      </div>
    </div>
  );
};

export default HeaderAbout;