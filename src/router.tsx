import { createBrowserRouter } from "react-router-dom";

import { LoginForm } from "./pages/auth/authForm";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { RegisterLayout } from "./pages/register-form/register-layout";
import { Step1 } from "./pages/register-form/steps/step1";
import { Step2 } from "./pages/register-form/steps/step2";
import { Step3 } from "./pages/register-form/steps/step3";
import { Layout } from "./pages/layout";
import { RoomsLayout } from "./pages/rooms-list/rooms-layout";
import LoggedGuard from "./guards/logged_guard";
import { TemplateDecision } from "./templates/template-decision";
import { UsersLayout } from "./pages/users-list/users-layout";
import { ReservationsLayout } from "./pages/reservations-list/reservations-layout";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterLayout />,
    children: [
      {
        path: "1",
        element: <Step1 />,
      },
      {
        path: "2",
        element: <Step2 />,
      },
      {
        path: "3",
        element: <Step3 />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <LoggedGuard>
        <Layout />
      </LoggedGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UsersLayout />,
      },
      {
        path: "rooms",
        element: <RoomsLayout />,
      },
      {
        path: "reservations",
        element: <ReservationsLayout />,
      },
    ],
  },
  {
    path: "/decision/reservation/:id",
    element: (
      <LoggedGuard>
        <TemplateDecision />
      </LoggedGuard>
    ),
  },
]);
