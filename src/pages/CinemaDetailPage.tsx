import { FC, useEffect, useState } from "react";
import { useTrendingMoviesStore } from "../store/useTrendingMovieStore";
import { movieDetail, movieImages, moviePosters } from "../apis/movie";
import Pagination from "@ui/Pagination";

interface CinemaDetailPageProps {
  movieId: number;
}

const imagePageSize = 8;
const posterPageSize = 5;
const blockSize = 15;

const CinemaDetailPage: FC<CinemaDetailPageProps> = ({ movieId }) => {
  const { trendingDayMovies } = useTrendingMoviesStore();
  const [posters, setPosters] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentPosterPage, setCurrentPosterPage] = useState(0);
  const [currentImagePage, setCurrentImagePage] = useState(0);
  const [posterCount, setPosterCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);

  let movie = trendingDayMovies.find((movie) => movie.movieId === movieId);

  const fetchData = async () => {
    const [posters, images] = await Promise.all([
      moviePosters(movieId, 0, posterPageSize),
      movieImages(movieId, 0, imagePageSize),
    ]);
    setPosters(posters.posters);
    setPosterCount(posters.totalCount);
    setImages(images.images);
    setImageCount(images.totalCount);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchMovie = async () => {
    try {
      const response = await movieDetail(movieId);
      movie = response;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!movie) {
      fetchMovie();
    }
  }, []);

  const posterPageMove = async () => {
    const posters = await moviePosters(
      movieId,
      currentPosterPage,
      posterPageSize
    );
    setPosters(posters.posters);
  };

  useEffect(() => {
    posterPageMove();
  }, [currentPosterPage]);

  const imagePageMove = async () => {
    const images = await movieImages(movieId, currentImagePage, imagePageSize);
    setImages(images.images);
  };

  useEffect(() => {
    imagePageMove();
  }, [currentImagePage]);

  const handlePosterPageChange = (page: number) => {
    setCurrentPosterPage(page);
  };

  const handleImagePageChange = (page: number) => {
    setCurrentImagePage(page);
  };

  console.log(movie?.overview);

  return (
    <main className="flex flex-col gap-8 items-center bg-white w-[1280px] px-8 rounded-2xl py-16">
      {movie?.overview && (
        <>
          <section className="flex flex-col gap-4 w-full">
            <h2 className="text-2xl text-slate-900">줄거리</h2>
            <p className="text-lg text-slate-500">{movie?.overview}</p>
          </section>
          <hr className="w-full border border-gray-300"></hr>
        </>
      )}
      <section className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl text-slate-900">포스터</h2>
        <div className="flex flex-col gap-8 items-center w-full justify-between">
          <div className="flex gap-4 w-full justify-between">
            {posters.map((poster, index) => {
              return (
                <div key={index} className="w-[220px] h-[330px]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${poster}`}
                    alt="poster"
                    className="object-cover w-full h-full"
                  />
                </div>
              );
            })}
          </div>
          <Pagination
            total={posterCount}
            value={currentPosterPage}
            onPageChange={handlePosterPageChange}
            blockSize={blockSize}
            pageSize={posterPageSize}
          >
            <Pagination.Navigator className="flex gap-4">
              <Pagination.Buttons className="PaginationButtons flex gap-4 font-bold text-slate-300" />
            </Pagination.Navigator>
          </Pagination>
        </div>
      </section>
      <hr className="w-full border border-gray-300"></hr>
      <section className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl text-slate-900">스틸이미지</h2>
        <div className="flex flex-col gap-8 items-center w-full justify-between">
          <div className="flex gap-4 w-full justify-between flex-wrap">
            {images.map((image, index) => {
              return (
                <div key={index} className="w-[292px] h-[170px]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${image}`}
                    alt="poster"
                    className="object-cover w-full h-full flex-shrink-0"
                  />
                </div>
              );
            })}
          </div>
          <Pagination
            total={imageCount}
            value={currentImagePage}
            onPageChange={handleImagePageChange}
            blockSize={blockSize}
            pageSize={imagePageSize}
          >
            <Pagination.Navigator className="flex gap-4">
              <Pagination.Buttons className="PaginationButtons flex gap-4 font-bold text-slate-300" />
            </Pagination.Navigator>
          </Pagination>
        </div>
      </section>
    </main>
  );
};

export default CinemaDetailPage;
