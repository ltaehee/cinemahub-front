import Login from "../pages/Login";
import Register from "../pages/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorPage from "../pages/ErrorPage";
import MainPage from "../pages/MainPage";
import CinemaDetailPage from "../pages/CinemaDetailPage";
import CinemaReviewPage from "../pages/CinemaReviewPage";
import BoxOfficePage from "../pages/BoxOfficePage";
import MyPage from "../pages/MyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MainPage />,
        children: [
          {
            path: "/cinema",
            element: <CinemaDetailPage />,
            children: [
              {
                path: "review",
                element: <CinemaReviewPage />,
              },
            ],
          },
        ],
      },
      {
        path: "boxoffice",
        element: <BoxOfficePage />,
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
        path: "/mypage",
        element: <MyPage />,
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
