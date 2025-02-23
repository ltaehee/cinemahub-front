import { FC } from "react";

interface CinemaDetailPageProps {
  movieId: number;
}

const CinemaDetailPage: FC<CinemaDetailPageProps> = ({ movieId }) => {
  return (
    <div className="bg-white w-[1280px] h-[1000px] rounded-2xl">{movieId}</div>
  );
};

export default CinemaDetailPage;
