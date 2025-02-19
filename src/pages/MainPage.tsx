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
  backdropPath: string;
  genreIds: [];
}

const MainPage = () => {
  const baseRef = useRef<HTMLDivElement>(null);
  const itemListRef = useRef<HTMLDivElement>(null);
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
      backdropPath: "",
      genreIds: [],
    },
  ]);

  const fetchMovies = async () => {
    try {
      const response = await trendingMovies();
      console.log(response);
      setTrendingDayMovie(response.trending_day);
      setTrendingWeekMovie(response.trending_week);
    } catch (err) {
      console.error("영화 정보를 가져오는데 실패했습니다.", err);
    }
  };

  useEffect(() => {
    fetchMovies();
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
                    key={movie.title}
                    className="px-4"
                    index={index}
                  >
                    <MainCard
                      key={movie.movieId}
                      movieId={movie.movieId}
                      title={movie.title}
                      releaseDate={movie.releaseDate}
                      backdropPath={movie.backdropPath}
                      genreIds={movie.genreIds}
                      trailer={movie.trailer}
                      logoPath={movie.logoPath}
                      koreanRating={movie.koreanRating}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselItemList>
          </Carousel.ItemContainer>
          <Carousel.Navigator className=" absolute right-[calc(2vw+80px)] bottom-[2vw] flex items-center">
            {(handlePrev, handleNext, displayIndex, itemLength) => (
              <>
                <button
                  className="bg-[rgba(0,0,0,0.5)] rounded-full opacity-50 hover:opacity-100 duration-300 ease-in-out b backdrop-blur-sm"
                  onClick={handlePrev}
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
              카테고리
            </h3>
          </div>
          <CarouselXscroll
            baseRect={baseRect}
            pixelMove={200}
            itemListRef={itemListRef}
            className="group h-[56px]"
          >
            <CarouselXscroll.ItemContainer className="h-full">
              <CarouselXscroll.Items className="flex gap-2">
                {genres.map((genre) => {
                  return (
                    <Button
                      key={genre.id}
                      className="bg-gray-500 hover:bg-gray-900 text-nowrap"
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
      </main>
    </>
  );
};

export default MainPage;
