import { useContext } from "react";

import { DisclaimerContext } from "~/context/disclaimer-context";
import DisclaimerPage from "~/pages/DisclaimerPage";

import HypnoticRing from "../HypnoticRing";
import Footer from "../layer/MainFooter";
import Header from "../layer/MainHeader";
import { useLocation } from "react-router-dom";
const Layout = ({ children }) => {
  const { accepted } = useContext(DisclaimerContext);

  if (!accepted) return <DisclaimerPage />;
  const location = useLocation();

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
