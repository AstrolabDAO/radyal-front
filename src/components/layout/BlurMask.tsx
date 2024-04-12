import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import Info from "~/assets/icons/info.svg?react";
import { Button } from "../styled";
export const ConnectMask = ({ title }) => {
  const { isConnected } = useAccount();
  const web3Modal = useWeb3Modal();
  if (isConnected) return;
  return (
    <div className="fixed z-50 bg-blur left-0 top-O w-full h-full flex flex-col justify-center">
      <div className="text-center">
        <Info className="centerXY fill-dark-700 w-40 z-10" />
        <div className="z-20 relative">
          <h1 className="text-4xl gilroy font-bold leading-10 mt-5 text-white">
            {title}
          </h1>
          <div className="text-xl gilroy font-semibold uppercase relative my-16">
            <span className="z-20 relative block">Please log-in first</span>
          </div>
          <div>
            <Button
              onClick={() => web3Modal.open({ view: "Connect" })}
              big={true}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
