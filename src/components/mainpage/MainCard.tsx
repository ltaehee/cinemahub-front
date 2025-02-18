import { FC } from "react";

interface MovieProps {
  movieId: string;
  title: string;
  releaseDate: string;
  backdropPath: number;
  genreIds: [number];
  trailer: string;
  logoPath: string;
  koreanRating: string;
}

const MainCard: FC<MovieProps> = ({
  movieId,
  title,
  releaseDate,
  backdropPath,
  genreIds,
  trailer,
  logoPath,
  koreanRating,
}) => {
  return <div>메인카드</div>;
};
export default MainCard;
