import Strategies from "../components/Strategies";
import HomePage from "../pages/HomePage";
import Test from "../pages/Test";

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
    path: "/test",
    element: <Test />,
  },
];
