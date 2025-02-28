import { useNavigate } from "react-router-dom";
import FavoritesBtn from "./FavoritesBtn";
import { genres } from "@consts/genres";
import { FC, useEffect, useState } from "react";
import { useModalOpenStore } from "../../store/useModalOpenStore";
import posterImg from "../../assets/images/defaultImage.jpg";
import StarYellowIcon from "../../icons/StarYellowIcon";
import { reviewScore } from "../../apis/review";

interface MovieProps {
  title: string;
  movieId: string;
  releaseDate: string;
  posterPath: string;
  genreIds: number[];
}

interface Review {
  totalStarScore: number;
  totalCount: number;
}

const MovieCard: FC<MovieProps> = ({
  posterPath,
  movieId,
  title,
  releaseDate,
  genreIds,
}) => {
  const navigate = useNavigate();
  const {
    setIsMovieOpen,
    setSelectedMovie,
    setIsPersonOpen,
    setSelectedPerson,
  } = useModalOpenStore();

  const [review, setReview] = useState<Review>({
    totalStarScore: 0,
    totalCount: 0,
  });

  const fetchReview = async () => {
    try {
      const review = await reviewScore(movieId);
      setReview({
        totalStarScore:
          review.reviewScore.totalStarScore % 1 === 0
            ? `${review.reviewScore.totalStarScore}.0`
            : review.reviewScore.totalStarScore.toFixed(1),
        totalCount: review.reviewLength,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const poster = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : posterImg;

  return (
    <div
      onClick={() => {
        setIsMovieOpen(true),
          setSelectedMovie(movieId),
          setIsPersonOpen(false),
          setSelectedPerson(null);
        navigate(`?movie=${movieId}`);
      }}
      className="cursor-pointer shadow-md w-full h-full rounded-md bg-white border border-gray-200"
    >
      <div className="relative overflow-hidden rounded-tl-md rounded-tr-md">
        <div className="h-[340px]">
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover select-none duration-300 ease-in-out hover:scale-110"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
        <FavoritesBtn
          favoriteType="Movie"
          favoriteId={movieId}
          className="absolute top-2 left-2 border border-gray-200 rounded-full"
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-lg font-semibold w-52 truncate">{title}</h3>

        {review.totalCount > 0 ? (
          <div className="flex gap-1">
            <StarYellowIcon className="w-5" />
            <p className="text-[#F5C518] text-sm">{`${review.totalStarScore} (${review.totalCount})`}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">리뷰가 없습니다.</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-gray-500">
            {releaseDate}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-500 truncate">
          {genreIds.map((genreId, index) => (
            <span key={`movie-card-genre-${index}`}>
              {genres.find((genre) => genre.id === genreId)?.name}{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
