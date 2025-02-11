import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CinemaDetailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("movie");

  const seoTitle = movieId ? `${movieId} - 영화 상세 정보` : "영화 상세 정보";
  const seoDescription = movieId
    ? `선택한 영화(${movieId})에 대한 정보를 확인하세요.`
    : "영화의 상세 정보를 확인하세요.";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>
      <Outlet />
      CinemaDetailPage
    </>
  );
};

export default CinemaDetailPage;
