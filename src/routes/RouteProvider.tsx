import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorPage from "../pages/ErrorPage";
import MainPage from "../pages/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const RouteProvider = () => {
  return <RouterProvider router={router} />;
};

export default RouteProvider;
