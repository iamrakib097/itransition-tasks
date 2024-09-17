import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginForm from "./Page/LoginForm";
import RegistrationForm from "./Page/RegistrationForm";
import Users from "./Page/Users";
import useCurrentUser from "./useCurrentUser";

export default function App() {
  const loggedInUser = useCurrentUser();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true, // This marks it as the default child route
          element: <Navigate to="login" replace />, // Redirect to login
        },
        {
          path: "login",
          element: loggedInUser ? (
            <Navigate to="/users" replace />
          ) : (
            <LoginForm />
          ),
        },
        {
          path: "registration",
          element: loggedInUser ? (
            <Navigate to="/users" replace />
          ) : (
            <RegistrationForm />
          ),
        },
        {
          path: "users",
          element: !loggedInUser ? <Navigate to="/login" replace /> : <Users />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
