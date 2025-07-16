import { useRoutes } from "react-router-dom";

import { lazy } from "react";

const Home = lazy(() => import("../views/Home"));
const Login = lazy(() => import("../views/Login"));

const Router = () => {
  let element = useRoutes([
    {
      path: "/",
      element: <Login /> ,
    },
    {
      path: "/admin",
      element: <Home />,
    },
  ]);

  return element;
};

export default Router;
