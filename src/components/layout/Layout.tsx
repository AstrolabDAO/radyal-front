import { useContext } from "react";

import { Toaster } from "react-hot-toast";

import { DisclaimerContext } from "~/context/disclaimer-context";
import DisclaimerPage from "~/pages/DisclaimerPage";

import Footer from "../layer/MainFooter";
import Header from "../layer/MainHeader";
import { COLORS } from "~/styles/constants";

const Layout = ({ children }) => {
  const { accepted } = useContext(DisclaimerContext);

  const style = {
    backdropFilter: "blur(10px)",
    color: COLORS["base-content"],
  };

  if (!accepted) return <DisclaimerPage />;

  return (
    <>
      <main className="min-h-screen">
        <Header />
        <div id="page-content" className="h-full relative">
          {children}
          <Toaster
            containerClassName="container"
            toastOptions={{
              success: {
                className: "strategy-card h-autp",
                style,
                iconTheme: {
                  primary: "var(--success)",
                  secondary: "transparent",
                },
              },
              error: {
                style,
                className: "strategy-card h-auto",
                iconTheme: {
                  primary: "var(--error)",
                  secondary: "transparent",
                },
              },
              loading: {
                style,
                className: "strategy-card h-auto",
                iconTheme: {
                  primary: "var(--warning)",
                  secondary: COLORS.base,
                },
              },
            }}
            position="top-right"
            reverseOrder={false}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default Layout;
