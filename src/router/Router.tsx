import { Navigate, useRoutes } from "react-router-dom";

import { lazy } from "react";

const Home = lazy(() => import("../views/Home"));
const Login = lazy(() => import("../views/auth/Login"));
const Register = lazy(() => import("@/views/auth/Register"));


const Router = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" />
    },
    {
      path: "/login",
      element: <Login /> ,
    },
    {
      path: "/register",
      element: <Register /> ,
    },
    {
      path: "/admin",
      element: <Home />,
    },
  ]);

  return element;
};

export default Router;
