import { useNavigate } from "react-router-dom";
import StarIcon from "../../icons/StarIcon";
import FavoritesBtn from "./FavoritesBtn";
import { genres } from "@consts/genres";
import { FC } from "react";

interface MovieProps {
  title: string;
  movieId: number;
  releaseDate: string;
  posterPath: string;
  genreIds: [];
}

const MovieCard: FC<MovieProps> = ({
  posterPath,
  movieId,
  title,
  releaseDate,
  genreIds,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`?movie=${movieId}`)}
      className="cursor-pointer shadow-md w-56 h-full rounded-md bg-white border border-gray-200"
    >
      <div className="relative overflow-hidden rounded-tl-md rounded-tr-md">
        <div className="h-[340px]">
          <img
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            className="h-full object-cover select-none duration-300 ease-in-out hover:scale-110"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
        <FavoritesBtn
          favoriteType="Movie"
          favoriteId={movieId.toString()}
          className="absolute top-2 left-2 border border-gray-200 rounded-full"
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-lg font-semibold w-52 truncate">{title}</h3>
        <div className="flex items-center gap-1">
          <StarIcon className="w-5" index={0} rating={1} />
          <div className="text-yellow-500 text-sm">4.0</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-gray-500">
            {releaseDate}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-500">
          {genreIds.map((genreId) => (
            <span key={genreId} className="pr-1">
              {genres.find((genre) => genre.id === genreId)?.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
