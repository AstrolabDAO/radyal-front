import { useContext, useState } from "react";
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";
import { DisclaimerContext } from "~/context/disclaimer-context";

import RiskDisclaimerMd from "~/assets/docs/risk.mdx";

const DisclaimerPage = () => {
  const { accept } = useContext(DisclaimerContext);
  const [saveDisclaimerStatus, setSaveDisclaimerStatus] =
    useState<boolean>(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveDisclaimerStatus(event.target.checked);
  };
  const handleAgreeClick = () => {
    accept(saveDisclaimerStatus);
  };

  return (
    <div id="disclaimer-page" className="relative container flex mx-auto h-screen">
      <div className="flex flex-col m-auto text-center">
        <h1 className="text-8xl font-bold"> RADYAL </h1>
        <div>ALGORITHMIC YIELD PRIMITIVES</div>
        <div className="w-2/3 xl:w-5/12 mx-auto mt-6 mb-3">
          <div className="border-solid border-2 border-sky-500 rounded-xl p-4 h-64 overflow-scroll text-white text-left text-sm">
            <RiskDisclaimerMd />
          </div>
        </div>
        <div className="flex flex-row mx-auto my-3">
          <input
            id="saveDisclaimerStatus"
            type="checkbox"
            className="checkbox me-2"
            checked={saveDisclaimerStatus}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="saveDisclaimerStatus">Hide for 30 days</label>
        </div>
        <button
          className="btn btn-primary mx-auto px-10 mb-6"
          onClick={handleAgreeClick}
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
