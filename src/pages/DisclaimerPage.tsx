import { useContext, useState } from "react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { DisclaimerContext } from "~/context/disclaimer-context";

import Lottie from "lottie-react";
import Logo from "~/assets/animations/logo.json";
import Acknowledgement from "~/assets/docs/acknowledgement.mdx";
import { Button } from "~/components/styled";
import Layout from "~/components/layout/Layout";
import { SocialNetworks } from "~/components/SocialNetworks";

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
    <div
      id="disclaimer-page"
      className="relative container flex mx-auto h-screen"
    >
      <div className="flex flex-col m-auto text-center text-white">
        <div className="w-52 h-52 mx-auto overflow-hidden my-3">
          <Lottie
            animationData={Logo}
            loop={true}
            className="scale-140 invert"
          />
        </div>
        <h1 className="text-8xl gilroy font-bold leading-10 mt-5">RADYAL</h1>
        <div className="text-2xl gilroy font-semibold mt-4">
          ALGORITHMIC YIELD PRIMITIVES
        </div>
        <div className="w-2/3 xl:w-8/12 mx-auto mt-6 mb-3">
          <div className="border-solid border-1 rounded-xl p-4 h-64 overflow-scroll text-left text-xs md disclaimer">
            <Acknowledgement />
          </div>
        </div>
        <div className="flex flex-row mx-auto mb-3">
          <input
            id="saveDisclaimerStatus"
            type="checkbox"
            className="checkbox checkbox-xs me-2 rounded-md checkbox-primary"
            checked={saveDisclaimerStatus}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="saveDisclaimerStatus" className="text-xs">
            Hide for 30 days
          </label>
        </div>
        <Button
          className="mb-10 mx-auto px-5 min-w-36"
          onClick={handleAgreeClick}
        >
          AGREE
        </Button>
        <SocialNetworks />
      </div>
    </div>
  );
};

export default DisclaimerPage;
