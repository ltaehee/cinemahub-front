import CarouselXscroll from "@ui/CarouselXscroll";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import ChevronIcon from "../icons/ChevronIcon";
import MainCard from "../components/mainpage/MainCard";
import Carousel from "@ui/CarouselInfinite";
import CarouselItem from "@ui/CarouselInfinite/CarouselInfiniteItem";
import CarouselItemList from "@ui/CarouselInfinite/CarouselInfiniteItemList";
import { genres } from "@consts/genres";
import Button from "../components/Button";
import { trendingMovies } from "../apis/movie";
import MovieCard from "../components/mainpage/MovieCard";
import { popularActors } from "../apis/person";
import PersonCard from "../components/mainpage/PersonCard";

interface trendingDayMovie {
  movieId: string;
  title: string;
  releaseDate: string;
  backdropPath: string;
  genreIds: [];
  trailer: string | null;
  logoPath: string | null;
  koreanRating: string;
}

interface trendingWeekMovie {
  movieId: string;
  title: string;
  releaseDate: string;
  posterPath: string;
  genreIds: [];
}

interface PopularActors {
  personId: number;
  name: string;
  profilePath: string;
}

const MainPage = () => {
  const baseRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const weekCardRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);
  const [baseRect, setBaseRect] = useState(new DOMRect());
  const [trendingDayMovie, setTrendingDayMovie] = useState<trendingDayMovie[]>([
    {
      movieId: "",
      title: "",
      releaseDate: "",
      backdropPath: "",
      genreIds: [],
      trailer: "",
      logoPath: null,
      koreanRating: "",
    },
  ]);
  const [trendingWeekMovie, setTrendingWeekMovie] = useState<
    trendingWeekMovie[]
  >([
    {
      movieId: "",
      title: "",
      releaseDate: "",
      posterPath: "",
      genreIds: [],
    },
  ]);
  const [popularPeople, setPopularPeople] = useState<PopularActors[]>([
    {
      personId: 0,
      name: "",
      profilePath: "",
    },
  ]);

  const fetchData = async () => {
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
      <Outlet />
      <main>
        <Carousel className="relative px-16 pt-8">
          <Carousel.ItemContainer>
            <CarouselItemList>
              {trendingDayMovie.map((movie, index) => {
                return (
                  <CarouselItem
                    key={movie.movieId}
                    className="px-4"
                    index={index}
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
                  </CarouselItem>
                );
              })}
            </CarouselItemList>
          </Carousel.ItemContainer>
          <Carousel.Navigator className=" absolute right-[calc(2vw+80px)] bottom-[2vw] flex items-center">
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
          </Carousel.Navigator>
        </Carousel>
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
                      key={genre.id}
                      className="bg-gray-500 hover:bg-gray-900 text-nowrap px-8 py-4"
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
                {trendingWeekMovie.map((movie) => {
                  return (
                    <MovieCard
                      key={movie.movieId}
                      movieId={movie.movieId}
                      title={movie.title}
                      releaseDate={movie.releaseDate}
                      posterPath={movie.posterPath}
                      genreIds={movie.genreIds}
                    ></MovieCard>
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
                      key={person.personId}
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
    </>
  );
};

export default MainPage;
