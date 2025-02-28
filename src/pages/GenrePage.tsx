import { genres } from "@consts/genres";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { genreMovies } from "../apis/movie";
import MovieCard from "../components/mainpage/MovieCard";
import ModalPage from "@ui/ModalPage";
import { useModalOpenStore } from "../store/useModalOpenStore";
import CinemaDetailPage from "./CinemaDetailPage";
import PersonDetailPage from "./PersonDetailPage";
import useGenreMovieStore from "../store/useGenreMovieStore";
import useInfinite from "../hooks/useInfinite";

const GenrePage = () => {
  const { genre } = useParams<{ genre: string }>();
  const genreId = Number(genre);
  const navigate = useNavigate();
  const infiniteDivRef = useRef<HTMLDivElement>(null);
  const { movies, setMovies, page, setPage, sortBy, setSortBy } =
    useGenreMovieStore();
  const {
    isMovieOpen,
    isPersonOpen,
    setIsMovieOpen,
    setIsPersonOpen,
    selectedMovie,
    setSelectedMovie,
    selectedPerson,
    setSelectedPerson,
  } = useModalOpenStore();

  const trigger = async () => {
    if (isMovieOpen || isPersonOpen) return;
    try {
      const response = await genreMovies(genreId, page + 1, 10, sortBy);
      setMovies([...movies, ...response]);
      setPage(page + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const { setTargetRef } = useInfinite(trigger, [page]);

  const genreIdNumber = () => {
    const isValidGenre = genres.some(({ id }) => id === genreId);

    if (!isValidGenre) {
      navigate("/error");
    }
  };

  const fetchMovies = async (genreId: number) => {
    try {
      const response = await genreMovies(genreId, 0, 10, sortBy);
      setMovies(response);
    } catch (err) {
      console.log(err);
    }
  };

  const sortByPopularity = () => {
    setSortBy("popularity");
    setMovies([]);
    setPage(0);
  };
  const sortByLatest = () => {
    setSortBy("latest");
    setMovies([]);
    setPage(0);
  };
  const sortByTitle = () => {
    setSortBy("title");
    setMovies([]);
    setPage(0);
  };

  useEffect(() => {
    genreIdNumber();
    fetchMovies(genreId);
    setTargetRef(infiniteDivRef);
  }, []);

  return (
    <>
      <main>
        <div>
          <button onClick={sortByPopularity}>인기순</button>
          <button onClick={sortByLatest}>최신순</button>
          <button onClick={sortByTitle}>이름순</button>
          <p>현재 정렬 기준: {sortBy}</p>
        </div>
        <section className="grid grid-cols-[repeat(auto-fill,_minmax(260px,1fr))] gap-4 px-8 pb-16">
          {movies.map((movie) => {
            if (!movie.movieId) return null;
            return (
              <MovieCard
                key={`gener-page-${movie.movieId}`}
                title={movie.title}
                movieId={movie.movieId}
                releaseDate={movie.releaseDate}
                posterPath={movie.posterPath}
                genreIds={movie.genreIds}
              />
            );
          })}
        </section>
      </main>

      <ModalPage
        pageParams="movie"
        setPageOpen={setIsMovieOpen}
        setSelectedPage={setSelectedMovie}
        selectedPage={selectedMovie}
        isPageOpen={isMovieOpen}
        pageFrom={`/genre/${genre}`}
      >
        {selectedMovie !== null && <CinemaDetailPage movieId={selectedMovie} />}
      </ModalPage>

      <ModalPage
        pageParams="person"
        setPageOpen={setIsPersonOpen}
        setSelectedPage={setSelectedPerson}
        selectedPage={selectedPerson}
        isPageOpen={isPersonOpen}
        pageFrom={`/genre/${genre}`}
      >
        {selectedPerson !== null && (
          <PersonDetailPage personId={selectedPerson} />
        )}
      </ModalPage>
      <div ref={infiniteDivRef}></div>
    </>
  );
};

export default GenrePage;
