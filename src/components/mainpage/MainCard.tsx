import { FC } from "react";
import Button from "../Button";
import { genres } from "@consts/genres";

interface MovieProps {
  movieId: string;
  title: string;
  releaseDate: string;
  backdropPath: string;
  genreIds: [];
  trailer: string | null;
  logoPath: string | null;
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
  return (
    <div
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${backdropPath})`,
      }}
      className="relative bg-cover bg-center w-full h-[56.25vw] flex items-center rounded-3xl text-white"
    >
      <div
        className="absolute inset-y-0 left-0 w-[80vw] rounded-l-3xl"
        style={{
          WebkitMaskImage: "linear-gradient(to right, black, transparent)",
          maskImage: "linear-gradient(to right, black, transparent)",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>

      <div
        className="relative flex flex-col gap-2 pl-[5vw] w-[40vw]"
        style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}
      >
        <div className="flex items-center w-[40vw]">
          {logoPath ? (
            <img
              src={`https://image.tmdb.org/t/p/original${logoPath}`}
              alt={title}
              className="pb-[4vw] max-w-[30vw] max-h-[30vw]"
            />
          ) : (
            <h1 className="pb-[2vw] text-5xl font-bold">{title}</h1>
          )}
        </div>
        <div>{releaseDate}</div>
        <div className="flex gap-2">
          {genreIds.map((genreId) => (
            <div
              key={genreId}
              className="bg-[rgba(0,0,0,0.4)] py-1 px-2 rounded-md"
            >
              {genres.find((genre) => genre.id === genreId)?.name}
            </div>
          ))}
        </div>
        <div>{koreanRating}</div>
        <Button className="">자세히 보기</Button>
      </div>
    </div>
  );
};
export default MainCard;
