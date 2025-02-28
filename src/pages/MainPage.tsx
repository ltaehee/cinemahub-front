import CarouselXscroll from "@ui/CarouselXscroll";
import CarouselInfinite from "@ui/CarouselInfinite";
import { useEffect, useRef, useState } from "react";
import ChevronIcon from "../icons/ChevronIcon";
import MainCard from "../components/mainpage/MainCard";
import { genres } from "@consts/genres";
import Button from "../components/Button";
import { trendingMovies } from "../apis/movie";
import { popularActors } from "../apis/person";
import PersonCard from "../components/mainpage/PersonCard";
import CinemaDetailPage from "./CinemaDetailPage";
import PersonDetailPage from "./PersonDetailPage";
import { useTrendingMoviesStore } from "../store/useTrendingMovieStore";
import { useModalOpenStore } from "../store/useModalOpenStore";
import ModalPage from "@ui/ModalPage";
import MovieCard from "../components/mainpage/MovieCard";
import { useNavigate } from "react-router-dom";

interface PopularActors {
  personId: string;
  name: string;
  profilePath: string;
}

const MainPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const baseRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const weekCardRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);
  const [baseRect, setBaseRect] = useState(new DOMRect());
  const {
    trendingDayMovies,
    trendingWeekMovies,
    setTrendingDayMovie,
    setTrendingWeekMovie,
  } = useTrendingMoviesStore();
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

  const [popularPeople, setPopularPeople] = useState<PopularActors[]>([
    {
      personId: "",
      name: "",
      profilePath: "",
    },
  ]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [movieResponse, actorResponse] = await Promise.all([
        trendingMovies(),
        popularActors(),
      ]);
      setTrendingDayMovie(movieResponse.trending_day);
      setTrendingWeekMovie(movieResponse.trending_week);
      setPopularPeople(actorResponse);
    } catch (err) {
      console.error("데이터를 가져오는데 실패했습니다.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <>
      <main>
        <CarouselInfinite className="relative px-16 pt-8">
          <CarouselInfinite.ItemContainer>
            <CarouselInfinite.ItemList>
              {isLoading ? (
                <div>로딩 중...</div>
              ) : trendingDayMovies.length > 0 ? (
                trendingDayMovies.map((movie, index) => {
                  return (
                    <CarouselInfinite.Item
                      className="px-4"
                      index={index}
                      key={`main-day-${movie.movieId}`}
                    >
                      {(carouselIndex) => (
                        <MainCard
                          movieId={movie.movieId}
                          title={movie.title}
                          releaseDate={movie.releaseDate}
                          backdropPath={movie.backdropPath}
                          genreIds={movie.genreIds}
                          trailer={movie.trailer}
                          logoPath={movie.logoPath}
                          koreanRating={movie.koreanRating}
                          carouselIndex={carouselIndex}
                          index={index + 1}
                        />
                      )}
                    </CarouselInfinite.Item>
                  );
                })
              ) : (
                <div>트렌딩 영화가 없습니다.</div>
              )}
            </CarouselInfinite.ItemList>
          </CarouselInfinite.ItemContainer>
          <CarouselInfinite.Navigator className=" absolute right-[calc(2vw+80px)] bottom-[2vw] flex items-center">
            {(
              handlePrev,
              handleNext,
              displayIndex,
              itemLength,
              isTransitioning
            ) => (
              <>
                <button
                  className="bg-[rgba(0,0,0,0.5)] rounded-full opacity-50 hover:opacity-100 duration-300 ease-in-out b backdrop-blur-sm"
                  onClick={handlePrev}
                  disabled={isTransitioning}
                >
                  <ChevronIcon height="40px" color="#fff" thickness="3" />
                </button>
                <div
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                  className="text-white text-xl px-2"
                >
                  {displayIndex}/{itemLength}
                </div>
                <button
                  className="bg-[rgba(0,0,0,0.5)] rounded-full opacity-50 hover:opacity-100 duration-300 ease-in-out backdrop-blur-sm"
                  onClick={handleNext}
                  disabled={isTransitioning}
                >
                  <ChevronIcon
                    height="40px"
                    color="#fff"
                    thickness="3"
                    className="rotate-180"
                  />
                </button>
              </>
            )}
          </CarouselInfinite.Navigator>
        </CarouselInfinite>
        <section className="pt-8">
          <div className="px-8">
            <h3 ref={baseRef} className="pb-2 font-medium text-xl">
              영화 카테고리
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
                        navigate(`/genre/${genre.id}`);
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
        <section className="pt-8">
          <div className="px-8">
            <h3 ref={baseRef} className="pb-2 font-medium text-xl">
              이번주 트렌드 영화
            </h3>
          </div>
          <CarouselXscroll
            baseRect={baseRect}
            pixelMove={window.outerWidth}
            itemListRef={weekCardRef}
            className="group"
          >
            <CarouselXscroll.ItemContainer className="h-full">
              <CarouselXscroll.Items className="flex gap-4">
                {trendingWeekMovies.map((movie) => {
                  return (
                    <MovieCard
                      key={`main-week-${movie.movieId}`}
                      movieId={movie.movieId}
                      title={movie.title}
                      releaseDate={movie.releaseDate}
                      posterPath={movie.posterPath}
                      genreIds={movie.genreIds}
                    />
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
        <section className="pt-8">
          <div className="px-8">
            <h3 ref={baseRef} className="pb-2 font-medium text-xl">
              이번주 인기 배우
            </h3>
          </div>
          <CarouselXscroll
            baseRect={baseRect}
            pixelMove={window.outerWidth}
            itemListRef={personRef}
            className="group pb-16"
          >
            <CarouselXscroll.ItemContainer className="h-full">
              <CarouselXscroll.Items className="flex gap-4">
                {popularPeople.map((person) => {
                  return (
                    <PersonCard
                      key={`main-person-${person.personId}`}
                      personId={person.personId}
                      name={person.name}
                      profilePath={person.profilePath}
                    />
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
      </main>

      <ModalPage
        pageParams="movie"
        setPageOpen={setIsMovieOpen}
        setSelectedPage={setSelectedMovie}
        selectedPage={selectedMovie}
        isPageOpen={isMovieOpen}
        pageFrom="/"
      >
        {selectedMovie !== null && <CinemaDetailPage movieId={selectedMovie} />}
      </ModalPage>

      <ModalPage
        pageParams="person"
        setPageOpen={setIsPersonOpen}
        setSelectedPage={setSelectedPerson}
        selectedPage={selectedPerson}
        isPageOpen={isPersonOpen}
        pageFrom="/"
      >
        {selectedPerson !== null && (
          <PersonDetailPage personId={selectedPerson} />
        )}
      </ModalPage>
    </>
  );
};

export default MainPage;
