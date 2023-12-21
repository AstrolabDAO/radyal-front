import SwapPage from "~/pages/SwapPage";
import Strategies from "~/components/StrategyList";
import HomePage from "~/pages/HomePage";

export default [
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
