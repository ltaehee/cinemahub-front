import { FC, useEffect, useRef, useState } from "react";
import { useTrendingMoviesStore } from "../store/useTrendingMovieStore";
import { movieDetail, movieImages, moviePosters } from "../apis/movie";
import Pagination from "@ui/Pagination";
import Modal from "@ui/Modal";
import XIcon from "../icons/XIcon";
import MuteIcon from "../icons/MuteIcon";
import UnMuteIcon from "../icons/UnMuteIcon";
import { useNavigate } from "react-router-dom";
import { genres } from "@consts/genres";

interface CinemaDetailPageProps {
  movieId: number;
}

interface Actor {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

interface Director {
  id: number;
  name: string;
  profilePath: string;
}

interface Movie {
  movieId: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string;
  backdropPath: string;
  genreIds: number[];
  trailer: string | null;
  logoPath: string | null;
  koreanRating: string;
  runtime: number;
  tagline: string;
  actor: Actor[];
  director: Director[];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const portalref = useRef<HTMLDivElement>(null);
  const [movie, setMovie] = useState<Movie | null>(
    trendingDayMovies.find((m) => m.movieId === movieId) || null
  );
  const navigate = useNavigate();

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

  const fetchMovie = async () => {
    try {
      const response = await movieDetail(movieId);
      setMovie(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!movie) {
      fetchMovie();
    }
  }, [movieId, movie]);

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

  const handleModalOpen = (content: string) => {
    setIsModalOpen(true);
    setContent(content);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleMute = () => setIsMuted((prev) => !prev);
  console.log(movie);
  return (
    <>
      <main
        ref={portalref}
        className="flex flex-col gap-8 items-center bg-white w-[1280px] rounded-2xl pb-16"
      >
        <div className="w-full relative">
          {movie?.trailer ? (
            <>
              <div className="w-full h-[692px]">
                <iframe
                  className="w-full h-full rounded-t-2xl"
                  src={`https://www.youtube.com/embed/${
                    movie.trailer
                  }?autoplay=1&loop=1&playlist=${movie.trailer}&mute=${
                    isMuted ? "1" : "0"
                  }&controls=0&modestbranding=1`}
                  allow="autoplay; fullscreen"
                ></iframe>
              </div>
              <button
                onClick={toggleMute}
                className="absolute top-1 left-1 z-1 bg-black/50 p-[0.5vw] rounded-full hover:bg-black/70 transition"
              >
                {isMuted ? (
                  <MuteIcon className="h-[2vw]" />
                ) : (
                  <UnMuteIcon className="h-[2vw]" />
                )}
              </button>
            </>
          ) : (
            <div className="w-full h-[692px] rounded-t-2xl bg-emerald-600">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdropPath})`,
                }}
              ></div>
            </div>
          )}
          <div>
            <div
              className="flex absolute inset-y-0 left-0 w-full rounded-t-2xl bg-black/50 backdrop-blur-[20px]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, black, transparent)",
                maskImage: "linear-gradient(to right, black, transparent)",
              }}
            ></div>
            <div className="flex flex-col absolute inset-y-0 left-16 top-[60%] text-white">
              {movie?.logoPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${movie?.logoPath}`}
                  alt={movie?.title}
                  className="pb-[2vw] max-w-[36vw] max-h-[25vw]"
                  onDragStart={(e) => e.preventDefault()}
                />
              ) : (
                <h1 className="pb-[2vw] text-6xl/[5vw] text-white font-bold">
                  {movie?.title}
                </h1>
              )}
              <button
                onClick={() => {
                  navigate(`/review?movie=${movieId}`), setIsMuted(true);
                }}
                className="py-4 w-80 text-xl bg-red-500/80 rounded-lg hover:bg-red-500 backdrop-blur-xs transition ease-in-out"
              >
                리뷰보기
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-8 px-8">
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie?.posterPath}`}
              alt={movie?.title}
              className="object-cover w-full h-full"
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
          <div className="flex flex-col gap-4 justify-center">
            <dl>
              <dt className="text-xl pb-2">개봉일</dt>
              <dd className="text-lg text-gray-500">{movie?.releaseDate}</dd>
            </dl>
            <hr className="w-full border border-gray-300"></hr>
            <dl>
              <dt className="text-xl pb-2">장르</dt>
              <dd className="flex gap-4 text-lg text-gray-500">
                {movie?.genreIds.map((genreId) => (
                  <span
                    key={genreId}
                    className="bg-[rgba(0,0,0,0.4)] py-2 px-4 rounded-md text-white text-base"
                  >
                    {genres.find((genre) => genre.id === genreId)?.name}
                  </span>
                ))}
              </dd>
            </dl>
            <hr className="w-full border border-gray-300"></hr>
            <dl>
              <dt className="text-xl pb-2">출연</dt>
              <dd className="flex gap-4 text-lg text-gray-500">
                {movie?.actor.map((actor) => (
                  <span
                    key={actor.id}
                    onClick={() => navigate("")}
                    className="cursor-pointer"
                  >
                    {actor.name}
                  </span>
                ))}
              </dd>
            </dl>
            <hr className="w-full border border-gray-300"></hr>
            <dl>
              <dt className="text-xl pb-2">감독</dt>
              <dd className="flex gap-4 text-lg text-gray-500">
                {movie?.director.map((director) => (
                  <span
                    key={director.id}
                    onClick={() => navigate("")}
                    className="cursor-pointer"
                  >
                    {director.name}
                  </span>
                ))}
              </dd>
            </dl>
            <hr className="w-full border border-gray-300"></hr>
            <dl>
              <dt className="text-xl pb-2">런타임</dt>
              <dd className="text-lg text-gray-500">{movie?.runtime} 분</dd>
            </dl>
            <hr className="w-full border border-gray-300"></hr>
          </div>
        </div>

        <div className="flex flex-col gap-8 items-center px-8">
          <hr className="w-full border border-gray-300"></hr>
          {movie?.overview && (
            <>
              <section className="flex flex-col gap-4 w-full">
                <h2 className="text-2xl text-slate-900">줄거리</h2>
                <p className="text-lg text-slate-500">{movie.overview}</p>
              </section>
              <hr className="w-full border border-gray-300"></hr>
            </>
          )}
          <section className="flex flex-col gap-4 w-full">
            <h2 className="text-2xl text-slate-900">포스터</h2>
            <div className="flex flex-col gap-8 items-center w-full justify-between">
              <div className="flex gap-4 w-full justify-between">
                {posters.map((poster) => {
                  return (
                    <div
                      key={poster}
                      onClick={() => handleModalOpen(poster)}
                      className="w-[220px] h-[330px]"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w185${poster}`}
                        alt="poster"
                        className="object-cover w-full h-full"
                        onDragStart={(e) => e.preventDefault()}
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
                {images.map((image) => {
                  return (
                    <div
                      key={image}
                      onClick={() => {
                        handleModalOpen(image), window.scrollTo(0, scrollY);
                      }}
                      className="w-[292px] h-[170px]"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w342${image}`}
                        alt="poster"
                        className="object-cover w-full h-full flex-shrink-0"
                        onDragStart={(e) => e.preventDefault()}
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
        </div>
      </main>
      <Modal
        onCloseModal={closeModal}
        open={isModalOpen}
        portalref={portalref.current}
      >
        <Modal.Content className="z-4 top-[50%] transform -translate-y-1/2 shadow-2xl">
          <Modal.Close>
            <XIcon fill="#fff" className="fixed top-4 right-4 w-6" />
          </Modal.Close>
          <img
            src={`https://image.tmdb.org/t/p/w780${content}`}
            alt="poster"
            onDragStart={(e) => e.preventDefault()}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CinemaDetailPage;
