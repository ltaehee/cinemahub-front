import star from "/images/star.svg";
import FavoritesBtn from "./FavoritesBtn";
interface MovieProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  genre: string;
  ageLimit: string;
}

const MovieCard: React.FC<MovieProps> = ({
  image,
  name,
  rating,
  genre,
  ageLimit,
}) => {
  const handleCardClick = () => {};

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer shadow-md w-56 rounded-md"
    >
      <div className="relative">
        <img
          src={image}
          alt="영화 이미지"
          className="rounded-tl-md rounded-tr-md select-none"
          onDragStart={(e) => e.preventDefault()}
        />
        <FavoritesBtn className="absolute top-2 left-2" />
      </div>
      <div className="p-2">
        <h3 className="text-lg font-semibold w-52 ">{name}</h3>
        <p className="text-sm mt-1 text-yellow-500">
          <div className="flex items-center space-x-1">
            <img src={star} alt="별" />
            <div className="p-0 flex items-center">{rating}</div>
          </div>
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-gray-500">{genre}</span>
          <span className="text-xs px-2 py-1 bg-gray-500 text-white">
            {ageLimit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
