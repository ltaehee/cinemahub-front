import StarIcon from "../../icons/StarIcon";
import FavoritesBtn from "./FavoritesBtn";
import { genres } from "@consts/genres";

interface MovieProps {
  title: string;
  releaseDate: string;
  posterPath: string;
  genreIds: [];
}

const MovieCard: React.FC<MovieProps> = ({
  posterPath,
  title,
  releaseDate,
  genreIds,
}) => {
  const handleCardClick = () => {};

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer shadow-md w-56 h-full rounded-md bg-white"
    >
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          className="h-[340px] object-cover rounded-tl-md rounded-tr-md select-none"
          onDragStart={(e) => e.preventDefault()}
        />
        <FavoritesBtn className="absolute top-2 left-2" />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-lg font-semibold w-52">{title}</h3>
        <div className="flex items-center gap-1">
          <StarIcon className="w-5" />
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
