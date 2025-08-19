import AppLayout from "@src/components/Layout";
import { ROUTES } from "@src/constants/routes";
import { AdminUsersPage } from "@src/pages/Admin/AdminUsersPages";
import { DashboardPage } from "@src/pages/Dashboard";
import { EventCreatePage } from "@src/pages/Event/EventCreatePages";
import { EventDetailPage } from "@src/pages/Event/EventDetailPage";
import { EventEditPage } from "@src/pages/Event/EventEditPage";
import { EventsListPage } from "@src/pages/Event/EventsListPage";
import { MyEventsPage } from "@src/pages/Event/MyEventPage";
import { MyFavoritesPage } from "@src/pages/Favorite/MyFavoritePage";
import { InstitutionCreatePage } from "@src/pages/Institution/InstitutionCreatePage";
import { InstitutionDetailPage } from "@src/pages/Institution/InstitutionDetailPage";
import { InstitutionEditPage } from "@src/pages/Institution/InstitutionEditPage";
import { InstitutionListPage } from "@src/pages/Institution/InstitutionListPage";
import LoginPage from "@src/pages/Login";
import NotFoundPage from "@src/pages/NotFound";
import { ProfilePage } from "@src/pages/Profile/ProfilePage";
import RegisterPage from "@src/pages/Register";
import { MyReservationsPage } from "@src/pages/Reservation/MyReservationsPage";
import { UserRole } from "@src/store/auth/auth.state";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <AppLayout />,
    children: [
      { index: true, element: <EventsListPage /> },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute roles={[UserRole.ORGANIZER, UserRole.ADMIN]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
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
        path: ROUTES.MY_EVENTS,
        element: (
          <ProtectedRoute roles={[UserRole.ORGANIZER, UserRole.ADMIN]}>
            <MyEventsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      { path: ROUTES.INSTITUTIONS, element: <InstitutionListPage /> },
      { path: ROUTES.INSTITUTION_DETAIL(), element: <InstitutionDetailPage /> },
      {
        path: ROUTES.INSTITUTION_CREATE,
        element: (
          <ProtectedRoute roles={[UserRole.ADMIN, UserRole.ORGANIZER]}>
            <InstitutionCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INSTITUTION_EDIT(),
        element: (
          <ProtectedRoute roles={[UserRole.ADMIN, UserRole.ORGANIZER]}>
            <InstitutionEditPage />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.MY_FAVORITES,
        element: (
          <ProtectedRoute>
            <MyFavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MY_RESERVATIONS,
        element: (
          <ProtectedRoute>
            <MyReservationsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.ADMIN_USERS,
        element: (
          <ProtectedRoute roles={[UserRole.ADMIN]}>
            <AdminUsersPage />
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
