import { createBrowserRouter } from "react-router-dom";

import { LoginForm } from "./pages/auth/authForm";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { RegisterLayout } from "./pages/register-form/register-layout";
import { Step1 } from "./pages/register-form/steps/step1";
import { Step2 } from "./pages/register-form/steps/step2";
import { Step3 } from "./pages/register-form/steps/step3";
import { UsersList } from "./pages/users-list/usersList";
import { Layout } from "./pages/layout";
import { RoomsLayout } from "./pages/rooms/rooms-layout";
import LoggedGuard from "./guards/logged_guard";
import { TemplateDecision } from "./templates/template-decision";

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
        element: <UsersList />,
      },
      {
        path: "rooms",
        element: <RoomsLayout />,
      },
    ],
  },
  {
    path: "/decision/reservation/:id",
    element: <TemplateDecision />,
  },
]);
