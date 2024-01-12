import { RouteObject } from "react-router-dom";

import SwapPage from "~/pages/SwapPage";
import Strategies from "~/components/StrategyList";
import HomePage from "~/pages/HomePage";
import DisclaimerPage from "~/pages/DisclaimerPage";

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
];

export default routes;
