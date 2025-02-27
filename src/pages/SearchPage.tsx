import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFetchMovieInfo, getFetchPeopleInfo } from "../apis/search";
import MovieCard from "../components/mainpage/MovieCard";
import PersonCard from "../components/mainpage/PersonCard";
import CarouselXscroll from "@ui/CarouselXscroll";
import ChevronIcon from "../icons/ChevronIcon";
import useInfinite from "../hooks/useInfinite";
import CinemaDetailPage from "./CinemaDetailPage";
import PersonDetailPage from "./PersonDetailPage";
import ModalPage from "@ui/ModalPage";
import { useModalOpenStore } from "../store/useModalOpenStore";

const isHangulConsonantPattern = /^[\u3131-\u314e]+$/; // 한글 자음 확인

interface People {
  id: string;
  name: string;
  profile_path: string;
}

interface PeopleWithMovie {
  poster_path: string;
  id: string;
  name: string;
  popularity: number;
  title: string;
  release_date: string;
  genre_ids: [];
}

interface Movie {
  movieId: string;
  posterPath: string;
  title: string;
  releaseDate: string;
  genreIds: [];
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [people, setPeople] = useState<People[]>([]);
  const [peopleWithMovie, setPeopleWithMovie] = useState<PeopleWithMovie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [baseRect, _] = useState(new DOMRect());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [responseTotalCount, setResponseTotalCount] = useState(0);
  const personRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");

  console.log("page: ", page);
  console.log("people: ", people);
  console.log("responseTotalCount: ", responseTotalCount);
  const getFetchData = async (keyword: string) => {
    setLoading(true);
    try {
      if (!keyword.trim()) {
        setHasMore(false);
        return;
      }
      if (category === "movie") {
        const response = await getFetchMovieInfo(keyword, page);
        setResponseTotalCount(response.totalCount);
        // console.log("response: ", response);
        if (response.movies.length > 0) {
          setMovies((prevMovies) => [...prevMovies, ...response.movies]);
        }
        setPeople([]);
      } else {
        const response = await getFetchPeopleInfo(keyword, page);
        setResponseTotalCount(response.totalPages);
        console.log("response: ", response);
        if (response.people.length > 0) {
          setPeople((prevPeople) => [...prevPeople, ...response.people]);
        }
        if (response.movies.length > 0) {
          setPeopleWithMovie((prevMovies) => [
            ...prevMovies,
            ...response.movies,
          ]);
        }
        setMovies([]);
      }
    } catch (err) {
      console.error("검색 오류: ", err);
    } finally {
      setLoading(false);
    }
  };

  const trigger = () => {
    if (
      hasMore &&
      !loading &&
      (movies.length > 0 || people.length > 0) // 데이터가 있을 경우에만 페이지 증가
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const { setTargetRef } = useInfinite(trigger, [page]);

  // 초기 검색어 검색 시 한글 자음만 입력 아닌 경우에 검색
  useEffect(() => {
    if (keyword && !isHangulConsonantPattern.test(keyword)) {
      setPage(1);
      setMovies([]);
      setPeople([]);
      setPeopleWithMovie([]);
      setHasMore(true);
      getFetchData(keyword);
    }
  }, [keyword]);

  // 2 페이지 이상일 때 실행
  useEffect(() => {
    if (
      keyword &&
      page > 1 &&
      hasMore &&
      !isHangulConsonantPattern.test(keyword)
    ) {
      getFetchData(keyword);
    }
  }, [page, hasMore, keyword]);

  // 검색한 전체 데이터 다 가져오면 api 호출 못하게
  useEffect(() => {
    if (
      (movies.length > 0 && responseTotalCount === movies.length) ||
      (people.length > 0 && responseTotalCount === page)
    ) {
      setHasMore(false);
    }
  }, [movies, people, responseTotalCount, page]);

  useEffect(() => {
    if (observerRef) {
      setTargetRef(observerRef);
    }
  }, [observerRef]);

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

  console.log(
    "window.location.search: ",
    window.location.pathname + window.location.search
  );
  console.log("경로: ", `/search?category=${category}&keyword=${keyword}`);

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
                {peopleWithMovie &&
                  peopleWithMovie.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movieId={movie.id}
                      title={movie.title}
                      releaseDate={movie.release_date}
                      posterPath={movie.poster_path}
                      genreIds={movie.genre_ids}
                    ></MovieCard>
                  ))}
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
                  movies.map((movie, index) => (
                    <MovieCard
                      key={`${movie.movieId}-${index}`}
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
          <>
            <ModalPage
              pageParams="movie"
              setPageOpen={setIsMovieOpen}
              setSelectedPage={setSelectedMovie}
              selectedPage={selectedMovie}
              isPageOpen={isMovieOpen}
              pageFrom={`/search?category=${category}&keyword=${keyword}`}
            >
              {selectedMovie !== null && (
                <CinemaDetailPage movieId={selectedMovie} />
              )}
            </ModalPage>

            <ModalPage
              pageParams="person"
              setPageOpen={setIsPersonOpen}
              setSelectedPage={setSelectedPerson}
              selectedPage={selectedPerson}
              isPageOpen={isPersonOpen}
              pageFrom={`/search?category=${category}&keyword=${keyword}`}
            >
              {selectedPerson !== null && (
                <PersonDetailPage personId={selectedPerson} />
              )}
            </ModalPage>
          </>

          {hasMore && !loading && <div ref={observerRef}></div>}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
