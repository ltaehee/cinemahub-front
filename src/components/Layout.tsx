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
    <div className="flex flex-col min-h-screen justify-between">
      {seo && (
        <Helmet>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
        </Helmet>
      )}
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
