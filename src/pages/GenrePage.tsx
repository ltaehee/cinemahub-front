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

const GenrePage = () => {
  const { genre } = useParams<{ genre: string }>();
  const genreId = Number(genre);
  const navigate = useNavigate();
  const infiniteDivRef = useRef<HTMLDivElement>(null);
  const { movies, setMovies } = useGenreMovieStore();
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

  const genreIdNumber = () => {
    const isValidGenre = genres.some(({ id }) => id === genreId);

    if (!isValidGenre) {
      navigate("/error");
    }
  };

  const fetchMovies = async (genreId: number) => {
    try {
      const response = await genreMovies(genreId, 0, 10);
      setMovies(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    genreIdNumber();
    fetchMovies(genreId);
  }, []);

  console.log(movies);

  return (
    <>
      <main>
        <section className="grid grid-cols-[repeat(auto-fill,_minmax(260px,1fr))] gap-4 px-8 pb-16">
          {movies.map((movie) => {
            return (
              <MovieCard
                key={movie.movieId}
                title={movie.title}
                movieId={movie.movieId}
                releaseDate={movie.releaseDate}
                posterPath={movie.posterPath}
                genreIds={movie.genreIds}
              />
            );
          })}
          <div ref={infiniteDivRef}></div>
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
    </>
  );
};

export default GenrePage;
