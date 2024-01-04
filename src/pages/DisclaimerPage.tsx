import { useEffect, useState, useContext } from "react";
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";

import router from "~/router/router";
import LocalStorageService from "~/services/localStorage";

import { LayoutContext } from "~/context/layout-context";
import RiskDisclaimerMd from "~/assets/docs/risk.mdx";

const DisclaimerPage = () => {
  const localStorageKey = 'disclaimerAccepted';
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  const [saveDisclaimerStatus, setSaveDisclaimerStatus] = useState<boolean>(false);
  const { setShowHeader, setShowFooter } = useContext(LayoutContext);

  useEffect(() => {
      // Retrieve data from local storage
      const localUserDisclaimerStatus = LocalStorageService
        .getItem<boolean | null>(localStorageKey);
      if (!localUserDisclaimerStatus) {
        setSaveDisclaimerStatus(false);
        return;
      }
      setShowHeader(true);
      setShowFooter(true);
      router.navigate('/');
  }, [setShowHeader, setShowFooter]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveDisclaimerStatus(event.target.checked);
  }

  const handleAgreeClick = () => {
    LocalStorageService
      .setItem(localStorageKey, saveDisclaimerStatus, thirtyDays);
    setShowHeader(true);
    setShowFooter(true);
    router.navigate('/');
  }
  return (
    <div id="home" className="container flex mx-auto h-screen">
      <div className="flex flex-col m-auto text-center">
        <h1 className="text-8xl font-bold"> RADYAL </h1>
        <div>
          ALGORITHMIC YIELD PRIMITIVES
        </div>
        <div className="w-2/3 xl:w-5/12 mx-auto mt-6 mb-3">
          <div className="border-solid border-2 border-sky-500 rounded-xl p-4 h-64 overflow-scroll">
            <RiskDisclaimerMd/>
          </div>
        </div>
        <div className="flex flex-row mx-auto my-3">
          <input
            id="saveDisclaimerStatus"
            type="checkbox"
            className="checkbox me-2"
            checked={ saveDisclaimerStatus }
            onChange={ handleCheckboxChange }
          />
          <label htmlFor="saveDisclaimerStatus">
            Hide for 30 days
          </label>
        </div>
        <button
          className="btn btn-primary mx-auto px-10 mb-6"
          onClick={ handleAgreeClick }
        >
          AGREE
        </button>
        <div className="flex flex-row mx-auto">
          <button>
            <FaTwitter className="h-8 w-8 mx-2" />
          </button>
          <button>
            <FaDiscord className="h-8 w-8 mx-2" />
          </button>
          <button>
            <FaGithub className="h-8 w-8 mx-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
