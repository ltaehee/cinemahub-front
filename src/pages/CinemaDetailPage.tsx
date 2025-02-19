import { Outlet, useLocation } from "react-router-dom";

const CinemaDetailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieTitle = queryParams.get("movie");

  return (
    <>
      <Outlet />
      {movieTitle} 상세페이지
    </>
  );
};

export default CinemaDetailPage;
