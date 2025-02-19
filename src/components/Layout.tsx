import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { seoConfig } from "@consts/seoConfig";

const getSeoData = (pathname: string, search: string) => {
  const queryParams = new URLSearchParams(search);
  const movieTitle = queryParams.get("movie");

  if (pathname.startsWith("/cinema") && movieTitle) {
    if (pathname === "/cinema/review") {
      return {
        title: `${movieTitle} - 영화 리뷰`,
        description: `영화 "${movieTitle}"에 대한 리뷰를 확인해보세요.`,
      };
    }
    return {
      title: `${movieTitle} - 영화 상세 정보`,
      description: `선택한 영화(${movieTitle})에 대한 정보를 확인해보세요.`,
    };
  }

  return seoConfig[pathname] || null;
};

const Layout = () => {
  const location = useLocation();
  const seo = getSeoData(location.pathname, location.search);

  return (
    <>
      {seo && (
        <Helmet>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
        </Helmet>
      )}
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
