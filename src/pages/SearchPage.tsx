import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFetchActorInfo, getFetchMovieInfo } from "../apis/search";
import MovieCard from "../components/mainpage/MovieCard";
import PersonCard from "../components/mainpage/PersonCard";
import CarouselXscroll from "@ui/CarouselXscroll";
import ChevronIcon from "../icons/ChevronIcon";
import useInfinite from "../hooks/useInfinite";

interface People {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string;
  known_for: [
    {
      poster_path: string;
      id: number;
      name: string;
      popularity: number;
      title: string;
      release_date: string;
      genre_ids: [];
    }
  ];
}

export interface Movie {
  movieId: number;
  posterPath: string;
  title: string;
  releaseDate: string;
  genreIds: [];
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [people, setPeople] = useState<People[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [baseRect, _] = useState(new DOMRect());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [responseTotalCount, setResponseTotalCount] = useState(0);
  const personRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const category = searchParams.get("category") ?? "movie";
  const keyword = searchParams.get("keyword") ?? "";

  // console.log("저장된 movie: ", movies);
  // console.log("page: ", page);
  const getFetchData = async (keyword: string) => {
    setLoading(true);
    try {
      if (category === "movie") {
        const response = await getFetchMovieInfo(keyword, page);
        setResponseTotalCount(response.totalCount);
        console.log("respone.movies: ", response.movies.length);
        if (response.movies.length > 0) {
          setMovies((prevMovies) => [...prevMovies, ...response.movies]);
        }
        setPeople([]);
      } else {
        const response = await getFetchActorInfo(keyword);
        setPeople(response);
        setMovies([]);
      }
    } catch (err) {
      console.error("검색 오류: ", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const { setTargetRef } = useInfinite(loadMore, [page]);

  useEffect(() => {
    if (keyword.length >= 2) {
      setPage(1);
      setMovies([]);
      setHasMore(true);
      getFetchData(keyword);
    }
  }, [keyword]);

  useEffect(() => {
    if (keyword.length >= 2 && page > 1 && hasMore) {
      getFetchData(keyword);
    }
  }, [page, hasMore, keyword]);

  useEffect(() => {
    setTargetRef(observerRef);
  }, []);

  useEffect(() => {
    if (movies.length > 0 && responseTotalCount === movies.length) {
      setHasMore(false);
    }
  }, [movies, responseTotalCount]);

  return (
    <>
      <div>
        <div className="mt-5 ">
          <h2 className="flex flex-col items-center pb-3 font-medium text-xl">
            "{keyword}" (으)로 검색한 결과 입니다.
          </h2>
          {loading && <p>로딩 중...</p>}

          {category === "person" && (
            <>
              <CarouselXscroll
                baseRect={baseRect}
                pixelMove={window.outerWidth}
                itemListRef={personRef}
                className="group pb-16"
              >
                <CarouselXscroll.ItemContainer className="h-full">
                  <CarouselXscroll.Items className="flex gap-4">
                    {people && people.length > 0
                      ? people.map((person) => (
                          <PersonCard
                            key={person.id}
                            personId={person.id}
                            name={person.name}
                            profilePath={person.profile_path}
                          />
                        ))
                      : !loading && <p>검색된 결과가 없습니다.</p>}
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

              <div className="mt-8 flex flex-col items-center">
                <h2 className="pb-3 font-medium text-xl">
                  "{keyword}"와 관련된 영화
                </h2>
              </div>
              <div
                className="grid gap-4 w-full pb-20r justify-items-center"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(224px, 1fr))",
                }}
              >
                {people &&
                  people.flatMap((person) =>
                    person.known_for.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movieId={movie.id}
                        title={movie.title}
                        releaseDate={movie.release_date}
                        posterPath={movie.poster_path}
                        genreIds={movie.genre_ids}
                      ></MovieCard>
                    ))
                  )}
              </div>
            </>
          )}

          {category === "movie" && (
            <>
              <div
                className="grid gap-4 w-full pb-20r justify-items-center"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
                }}
              >
                {movies &&
                  movies.map((movie) => (
                    <MovieCard
                      key={movie.movieId}
                      movieId={movie.movieId}
                      title={movie.title}
                      posterPath={movie.posterPath}
                      releaseDate={movie.releaseDate}
                      genreIds={movie.genreIds}
                    ></MovieCard>
                  ))}
              </div>
            </>
          )}

          {hasMore && !loading && <div ref={observerRef}></div>}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
