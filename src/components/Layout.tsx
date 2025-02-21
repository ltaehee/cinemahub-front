import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { seoConfig } from "@consts/seoConfig";
import Footer from "./Footer";

const getSeoData = (pathname: string) => {
  return seoConfig[pathname] || null;
};

const Layout = () => {
  const location = useLocation();
  const seo = getSeoData(location.pathname);

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
      <Footer />
    </>
  );
};

export default Layout;
