import AppLayout from "@src/components/Layout";
import { ROUTES } from "@src/constants/routes";
import DashboardPage from "@src/pages/Dashboard";
import { EventCreatePage } from "@src/pages/Event/EventCreatePages";
import { EventDetailPage } from "@src/pages/Event/EventDetailPage";
import { EventEditPage } from "@src/pages/Event/EventEditPage";
import { EventsListPage } from "@src/pages/Event/EventsListPage";
import LoginPage from "@src/pages/Login";
import NotFoundPage from "@src/pages/NotFound";
import RegisterPage from "@src/pages/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.EVENTS, element: <EventsListPage /> },
      { path: ROUTES.EVENT_DETAIL(), element: <EventDetailPage /> },
      {
        path: ROUTES.EVENT_CREATE,
        element: (
          <ProtectedRoute>
            <EventCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EVENT_EDIT(),
        element: (
          <ProtectedRoute>
            <EventEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
    ],
  },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
