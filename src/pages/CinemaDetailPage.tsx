import { FC } from "react";
import { Outlet } from "react-router-dom";

interface CinemaDetailPageProps {
  movieId: number;
}

const CinemaDetailPage: FC<CinemaDetailPageProps> = ({ movieId }) => {
  return (
    <>
      <Outlet />
      <div className="bg-white w-[1280px] h-[2000px] rounded-2xl">
        {movieId}
      </div>
    </>
  );
};

export default CinemaDetailPage;
