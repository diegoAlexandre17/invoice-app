import { Navigate, useRoutes } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { CompanyProtectedRoute } from "../components/CompanyProtectedRoute";
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
const InvoiceDetails = lazy(() => import("@/views/invoices/InvoiceDetails"));

const DefaultRoute = "/admin/dashboard";

const Router = () => {
  let element = useRoutes([
    {
      path: "/admin",
      index: true,
      element: <Navigate replace to={DefaultRoute} />,
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
        {
          path: "/admin/invoices",
          element: (
            <CompanyProtectedRoute>
              <InvoicesTable />
            </CompanyProtectedRoute>
          ),
        },
        {
          path: "/admin/invoices/create",
          element: (
            <CompanyProtectedRoute>
              <InvoiceStepper />
            </CompanyProtectedRoute>
          ),
        },
        {
          path: "/admin/invoices/:invoice_id",
          element: (
            <CompanyProtectedRoute>
              <InvoiceDetails />
            </CompanyProtectedRoute>
          ),
        },
        { path: "/admin/customers", element: <Customers /> },
        { path: "/admin/company", element: <Company /> },
        // Aquí puedes agregar más rutas hijas protegidas
      ],
    },
  ]);

  return element;
};

export default Router;
