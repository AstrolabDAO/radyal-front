import { RouteObject } from "react-router-dom";

import SwapPage from "~/pages/SwapPage";
import Strategies from "~/components/StrategyList";
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
    path: "/strategies",
    element: <Strategies />,
  },
  {
    path: "/swap",
    element: <SwapPage />,
  },
  {
    path: "/tos",
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
