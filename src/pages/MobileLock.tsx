import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

import Lottie from "lottie-react";
import Logo from "~/assets/animations/logo.json";

const MobileLock = () => {
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
        <div className="text-2xl gilroy font-semibold my-8">
          The application is not yet available on mobile.
        </div>
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

export default MobileLock;
