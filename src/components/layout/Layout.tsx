import { useContext } from "react";

import { Toaster } from "react-hot-toast";

import { DisclaimerContext } from "~/context/disclaimer-context";
import DisclaimerPage from "~/pages/DisclaimerPage";

import Footer from "../layer/MainFooter";
import Header from "../layer/MainHeader";

const Layout = ({ children }) => {
  const { accepted } = useContext(DisclaimerContext);

  const style = {
    backdropFilter: "blur(10px)",
    color: "var(--gray-500)",
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
                  secondary: "black",
                },
              },
              error: {
                style,
                className: "strategy-card h-auto",
                iconTheme: {
                  primary: "var(--error)",
                  secondary: "black",
                },
              },
              loading: {
                style,
                className: "strategy-card h-auto",
                iconTheme: {
                  primary: "var(--warning)",
                  secondary: "#3f3f3f",
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
