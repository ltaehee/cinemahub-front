import { genres } from "@consts/genres";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { genreMovies } from "../apis/movie";
import MovieCard from "../components/mainpage/MovieCard";
import ModalPage from "@ui/ModalPage";
import { useModalOpenStore } from "../store/useModalOpenStore";
import CinemaDetailPage from "./CinemaDetailPage";
import PersonDetailPage from "./PersonDetailPage";
import useGenreMovieStore from "../store/useGenreMovieStore";
import useInfinite from "../hooks/useInfinite";
import CarouselXscroll from "@ui/CarouselXscroll";
import Button from "../components/Button";
import ChevronIcon from "../icons/ChevronIcon";
import Select from "@ui/Select";

type SelectedItem = {
  label: ReactNode;
  value: string;
};

const GenrePage = () => {
  const { genre } = useParams<{ genre: string }>();
  const genreId = Number(genre);
  const baseRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const [baseRect, setBaseRect] = useState(new DOMRect());
  const navigate = useNavigate();

  const infiniteDivRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    label: "인기순",
    value: "popularity",
  });
  const {
    movies,
    setMovies,
    page,
    totalPages,
    setPage,
    sortBy,
    setSortBy,
    setTotalPages,
    totalMovies,
    setTotalMovies,
  } = useGenreMovieStore();
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

  const calculateBaseDivRect = () => {
    if (!baseRef.current) return;
    setBaseRect(baseRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    calculateBaseDivRect();

    const handleResize = () => {
      calculateBaseDivRect();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const trigger = async () => {
    if (isMovieOpen || isPersonOpen || page >= totalPages) return;
    try {
      const response = await genreMovies(genreId, page + 1, 10, sortBy);
      setMovies([...movies, ...response.movies]);
      setPage(page + 1);
      setTotalMovies(response.totalMovies);
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
      setMovies(response.movies);
      setTotalPages(response.totalPages);
      setTotalMovies(response.totalMovies);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeValue = (selectedValue: string) => {
    setSortBy(selectedValue);
    setMovies([]);
    setPage(0);
  };

  useEffect(() => {
    genreIdNumber();
    fetchMovies(genreId);
    setTargetRef(infiniteDivRef);
  }, [genreId]);

  const currentGenre = genres.find((g) => g.id === genreId)?.name;

  return (
    <>
      <main className="flex flex-col gap-16">
        <section className="pt-8">
          <div className="px-8">
            <h3 ref={baseRef} className="pb-2 font-medium text-xl">
              장르별 영화
            </h3>
          </div>
          <CarouselXscroll
            baseRect={baseRect}
            pixelMove={window.outerWidth}
            itemListRef={genreRef}
            className="group"
          >
            <CarouselXscroll.ItemContainer className="h-full">
              <CarouselXscroll.Items className="flex gap-4">
                {genres.map((genre) => {
                  return (
                    <Button
                      key={`main-genre-${genre.id}`}
                      className="bg-gray-500 hover:bg-gray-900 text-nowrap px-8 py-4"
                      onClick={() => {
                        navigate(`/genre/${genre.id}`),
                          handleChangeValue("popularity");
                        setSelectedItem({
                          label: "인기순",
                          value: "popularity",
                        });
                      }}
                    >
                      {genre.name}
                    </Button>
                  );
                })}
              </CarouselXscroll.Items>
            </CarouselXscroll.ItemContainer>
            <CarouselXscroll.Navigator>
              {(prev, next, leftStyle, rightStyle) => (
                <>
                  <button
                    className="bg-[rgba(255,255,255,0.5)] rounded-full opacity-0 group-hover:opacity-100 duration-300 ease-in-out b backdrop-blur-sm"
                    style={leftStyle}
                    onClick={prev}
                  >
                    <ChevronIcon height="56px" />
                  </button>
                  <button
                    className="bg-[rgba(255,255,255,0.5)] rounded-full opacity-0 group-hover:opacity-100 duration-300 ease-in-out backdrop-blur-sm"
                    style={rightStyle}
                    onClick={next}
                  >
                    <ChevronIcon height="56px" className="rotate-180" />
                  </button>
                </>
              )}
            </CarouselXscroll.Navigator>
          </CarouselXscroll>
        </section>
        <section>
          <div className="flex justify-between px-8">
            <h3 className="pb-2 font-medium text-xl">{`${currentGenre} (${totalMovies})`}</h3>
            <Select
              onChange={handleChangeValue}
              value={sortBy}
              item={selectedItem}
              setItem={setSelectedItem}
              position="bottom-left"
            >
              <Select.Trigger />
              <Select.Content className="bg-white p-3 border border-gray-300 rounded-md shadow-md">
                <Select.Item value={"popularity"}>인기순</Select.Item>
                <Select.Item value={"latest"}>최신순</Select.Item>
                <Select.Item value={"title"}>이름순</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(260px,1fr))] gap-4 px-8 pb-16">
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
          </div>
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
