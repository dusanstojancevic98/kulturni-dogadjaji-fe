import Layout from "@src/components/Layout";
import LoginPage from "@src/pages/Login";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        index: true,
        element: <div>Početna stranica</div>, // Zameni pravom komponentom
      },
    ],
  },
]);
