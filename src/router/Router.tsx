import { useRoutes } from "react-router-dom";

import { lazy } from "react";

const Home = lazy(() => import("../views/Home"));
const Login = lazy(() => import("../views/Login"));

const Router = () => {
  let element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return element;
};

export default Router;
