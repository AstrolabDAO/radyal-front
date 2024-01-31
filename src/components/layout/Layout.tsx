import { useContext } from "react";

import router from "~/router/router";
import { RouterProvider } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import DisclaimerPage from "~/pages/DisclaimerPage";
import { DisclaimerContext } from "~/context/disclaimer-context";

import Header from "../layer/MainHeader";
import Footer from "../layer/MainFooter";

const Layout = ({ changeColor }) => {
  const { accepted } = useContext(DisclaimerContext);
  if (!accepted) return <DisclaimerPage />;
  return (
    <>
      <main className="min-h-screen">
        <Header
          emitMint={ changeColor }
        />
        <div id="page-content" className="h-full relative">
          <RouterProvider router={router} />
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default Layout;
