import { Navigate, useRoutes } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import Viewer from "@/views/invoices/viewer";

const Home = lazy(() => import("../views/Home"));
const Login = lazy(() => import("../views/auth/Login"));
const Register = lazy(() => import("@/views/auth/Register"));
const RecoveryPassword = lazy(() => import("@/views/auth/RecoveryPassword"));
const RessetPassword = lazy(() => import("@/views/auth/ResetPassword"));
const Customers = lazy(() => import("@/views/customers/Customers"));
const Company = lazy(() => import("@/views/company/Company"));

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
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/admin", element: <h1>Dashboard</h1> },
        { path: "/admin/invoice", element: <Viewer /> },
        { path: "/admin/customers", element: <Customers /> },
        { path: "/admin/company", element: <Company /> },
        // Aquí puedes agregar más rutas hijas protegidas
      ],
    },
  ]);

  return element;
};

export default Router;
