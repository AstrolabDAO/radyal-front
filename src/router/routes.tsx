import { RouteObject } from "react-router-dom";

import HomePage from "~/pages/HomePage";
import TOSPage from "~/pages/TOSPage";
import PrivacyPolicyPage from "~/pages/PrivacyPolicyPage";
import RiskDisclaimerPage from "~/pages/RiskDisclaimerPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/terms-of-service",
    element: <TOSPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/risk-disclaimer",
    element: <RiskDisclaimerPage />,
  },
];

export default routes;
