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
import useLoginStore from "../store/useStore";
import { getFetchUserSession } from "../apis/login";
import { useEffect } from "react";
import PublicRoute from "./PublicRouter";
import PrivateRoute from "./ProtectedRouter";
import SearchPage from "../pages/SearchPage";

const RouteProvider = () => {
  const login = useLoginStore((state) => state.login);
  const logout = useLoginStore((state) => state.logout);

  const handleUserSession = async () => {
    try {
      const response = await getFetchUserSession();
      if (response.result) {
        login();
      } else {
        logout();
      }
    } catch (e) {}
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <PrivateRoute element={<MainPage />} />,
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
          element: <PublicRoute element={<Login />} />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/mypage",
          element: <MyPage />,
        },
        {
          path: "/search",
          element: <SearchPage />,
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  useEffect(() => {
    handleUserSession();
  }, []);

  return <RouterProvider router={router} />;
};

export default RouteProvider;
