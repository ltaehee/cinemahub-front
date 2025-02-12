import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const mapPathToSeo: { [key: string]: { title: string; description: string } } =
  {
    "/": {
      title: "CinemaHub",
      description: "영화검색, 영화평가글쓰기가 가능한 홈페이지입니다.",
    },
    "/cinema/review": {
      title: "영화 리뷰 작성",
      description: "이 영화에 대한 당신의 생각을 공유해보세요!",
    },
    "/boxoffice": {
      title: "영화 박스오피스",
      description: "현재 상영중인 영화 순위를 확인하세요.",
    },
  };

const getSeoData = (pathname: string) => {
  const matchedKey = Object.keys(mapPathToSeo).find((pattern) => {
    const regex = new RegExp(`^${pattern.replace(/:\w+/g, "[^/]+")}$`);
    return regex.test(pathname);
  });

  return matchedKey ? mapPathToSeo[matchedKey] : null;
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
    </>
  );
};

export default Layout;
