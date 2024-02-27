import { RouteObject } from "react-router-dom";

import HomePage from "~/pages/HomePage";
import TOSPage from "~/pages/TOSPage";
import PrivacyPolicyPage from "~/pages/PrivacyPolicyPage";
import RiskDisclaimerPage from "~/pages/RiskDisclaimerPage";
import { FolioPage } from "~/pages/Folio";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/folio",
    element: <FolioPage />,
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
