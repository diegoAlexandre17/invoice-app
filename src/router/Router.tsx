import { Navigate, useRoutes } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";

const Home = lazy(() => import("../views/Home"));
const Login = lazy(() => import("../views/auth/Login"));
const Register = lazy(() => import("@/views/auth/Register"));
const RecoveryPassword = lazy(() => import("@/views/auth/RecoveryPassword"));
const RessetPassword = lazy(() => import("@/views/auth/ResetPassword"));

const Router = () => {
  let element = useRoutes([
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/recovery-password",
      element: <RecoveryPassword />,
    },
    {
      path: "/reset-password",
      element: <RessetPassword />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Home />
        </ProtectedRoute>
      ),
    },
  ]);

  return element;
};

export default Router;
