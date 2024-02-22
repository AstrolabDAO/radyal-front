import Lottie from "lottie-react";
import Logo from "~/assets/animations/logo.json";
import { SocialNetworks } from "~/components/SocialNetworks";

const MobileLock = () => {
  return (
    <div
      id="disclaimer-page"
      className="relative container flex mx-auto h-screen w-screen"
    >
      <div className="flex flex-col m-auto text-center text-white">
        <div className="w-32 h-32 sm:w-52 sm:h-52 mx-auto overflow-hidden my-3">
          <Lottie
            animationData={Logo}
            loop={true}
            className="scale-140 invert"
          />
        </div>
        <h1 className="text-4xl sm: text:8xl gilroy font-bold leading-10 mt-5">
          RADYAL
        </h1>
        <div className="text-xl md:text-2xl gilroy font-semibold my-8">
          The application is not yet available on mobile.
        </div>
        <SocialNetworks />
      </div>
    </div>
  );
};

export default MobileLock;
