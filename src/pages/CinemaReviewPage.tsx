import { useLocation } from "react-router-dom";

const CinemaReviewPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieTitle = queryParams.get("movie");
  return <>{movieTitle} 리뷰</>;
};

export default CinemaReviewPage;
