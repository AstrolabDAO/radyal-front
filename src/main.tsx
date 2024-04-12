import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import App from "./App.tsx";

import { store } from "./store/index.ts";
import "./styles/index.css";
import { Toaster } from "react-hot-toast";
import { COLORS } from "./styles/constants.ts";

const style = {
  backdropFilter: "blur(10px)",
  color: COLORS["base-content"],
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
    <Toaster
      containerClassName="z-50"
      toastOptions={{
        success: {
          className: "strategy-card h-auto",
          style,
          iconTheme: {
            primary: COLORS.success,
            secondary: "#fff",
          },
        },
        error: {
          style,
          className: "strategy-card h-auto",
          iconTheme: {
            primary: COLORS.error,
            secondary: "#FFF",
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
  </React.StrictMode>
);
