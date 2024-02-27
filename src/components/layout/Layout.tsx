import { useContext } from "react";

import { Toaster } from "react-hot-toast";

import { DisclaimerContext } from "~/context/disclaimer-context";
import DisclaimerPage from "~/pages/DisclaimerPage";

import Footer from "../layer/MainFooter";
import Header from "../layer/MainHeader";
import { COLORS } from "~/styles/constants";
import HypnoticRing from "../HypnoticRing";

const Layout = ({ children }) => {
  const { accepted } = useContext(DisclaimerContext);

  if (!accepted) return <DisclaimerPage />;

  return (
    <>
      <main className="min-h-screen">
        <Header />
        <div
          id="page-content"
          className="h-full relative overflow-x-hidden z-20"
        >
          {children}
        </div>
      </main>
      <HypnoticRing />
      <Footer />
    </>
  );
};
export default Layout;
