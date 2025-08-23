import { Navigate, useRoutes } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import InvoiceStepper from "@/views/invoices/InvoiceStepper";


const Home = lazy(() => import("../views/Home"));
const Login = lazy(() => import("../views/auth/Login"));
const Register = lazy(() => import("@/views/auth/Register"));
const RecoveryPassword = lazy(() => import("@/views/auth/RecoveryPassword"));
const RessetPassword = lazy(() => import("@/views/auth/ResetPassword"));
const Customers = lazy(() => import("@/views/customers/Customers"));
const Company = lazy(() => import("@/views/company/Company"));
const InvoicesTable = lazy(() => import("@/views/invoices/InvoicesTable"));

const DefaultRoute = '/admin/dashboard'

const Router = () => {
  let element = useRoutes([
    {
        path: '/admin',
        index: true,
        element: <Navigate replace to={DefaultRoute} />
    },
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
        { path: "/admin/dashboard", element: <h1>Dashboard</h1> },
        { path: "/admin/invoices", element: <InvoicesTable/> },
        { path: "/admin/invoices/create", element: <InvoiceStepper /> },
        { path: "/admin/customers", element: <Customers /> },
        { path: "/admin/company", element: <Company /> },
        // Aquí puedes agregar más rutas hijas protegidas
      ],
    },
  ]);

  return element;
};

export default Router;
