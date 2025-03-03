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
import useSearchStore from "../store/useSearchStore";

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
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [page, setPage] = useState(1);
  const { movies, setMovies, page, setPage, resetStore } = useSearchStore();

  const [searchParams] = useSearchParams();
  const [people, setPeople] = useState<People[]>([]);
  const [peopleWithMovie, setPeopleWithMovie] = useState<PeopleWithMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [baseRect, _] = useState(new DOMRect());
  const [hasMore, setHasMore] = useState(true);
  const [responseTotalCount, setResponseTotalCount] = useState(0);
  const personRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const [keywordState, setKeywordState] = useState<string>(keyword || "");
  const [categoryState, setCategoryState] = useState<string>(category || "");

  // console.log("page: ", page);
  // console.log("peopleWithMovie: ", peopleWithMovie);
  // console.log("people: ", people);
  // console.log("movies: ", movies);
  // console.log("responseTotalCount: ", responseTotalCount);

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

  const getFetchData = async (keyword: string) => {
    if (isMovieOpen || isPersonOpen) return;
    setLoading(true);
    try {
      if (!keyword.trim()) {
        setHasMore(false);
        return;
      }
      if (category === "movie") {
        const response = await getFetchMovieInfo(keyword, page);
        setResponseTotalCount(response.totalCount);
        console.log("response movie: ", response);

        setMovies((prevMovies) => {
          const prevMovieIds = new Set(
            prevMovies.map((movie) => movie.movieId)
          );
          const newMovies = response.movies.filter(
            (movie: Movie) => !prevMovieIds.has(movie.movieId)
          );
          return page === 1 ? newMovies : [...prevMovies, ...newMovies];
        });
        // if (response.movies.length > 0) {
        //   setMovies([...movies, ...response.movies]);
        // }
        setPeople([]);
      } else {
        const response = await getFetchPeopleInfo(keyword, page);
        setResponseTotalCount(response.totalPages);
        console.log("response people: ", response);
        setPeople((prevPeople) => {
          const prevPeopleIds = new Set(prevPeople.map((person) => person.id));
          const newPeople = response.people.filter(
            (person: People) => !prevPeopleIds.has(person.id)
          );
          return [...prevPeople, ...newPeople];
        });

        setPeopleWithMovie((prevMovies) => {
          const prevMoviesIds = new Set(prevMovies.map((movie) => movie.id));
          const newMovies = response.movies.filter(
            (movie: PeopleWithMovie) => !prevMoviesIds.has(movie.id)
          );
          return [...prevMovies, ...newMovies];
        });
        // setMovies([]);
      }
    } catch (err) {
      console.error("검색 오류: ", err);
    } finally {
      setLoading(false);
    }
  };

  const trigger = () => {
    if (isMovieOpen || isPersonOpen || loading || !hasMore) return;

    if (
      movies.length > 0 ||
      people.length > 0 // 데이터가 있을 경우에만 페이지 증가
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const { setTargetRef } = useInfinite(trigger, [page]);

  // 초기 검색어 검색 시 한글 자음만 입력 아닌 경우에 검색
  useEffect(() => {
    if (!keyword || isHangulConsonantPattern.test(keyword)) return;
    if (movies.length === 0) {
      setMovies([]);
    }
    if (people.length === 0) {
      setPeople([]);
    }
    if (peopleWithMovie.length === 0) {
      setPeopleWithMovie([]);
    }
    setPage(1);
    setHasMore(true);
    if (!isMovieOpen && !isPersonOpen) {
      getFetchData(keyword);
    }
  }, [keyword]);

  // 2 페이지 이상일 때 실행
  useEffect(() => {
    if (
      keyword &&
      page > 1 &&
      hasMore &&
      !isHangulConsonantPattern.test(keyword) &&
      !isMovieOpen &&
      !isPersonOpen
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
      console.log("모든 데이터를 불러왔습니다. 더 이상 요청하지 않습니다.");
      setHasMore(false);
    }
  }, [movies, people, responseTotalCount, page]);

  // 홈 일땐 영화값 초기화
  useEffect(() => {
    if (location.pathname === "/") {
      resetStore();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (observerRef) {
      setTargetRef(observerRef);
    }
  }, [observerRef]);

  useEffect(() => {
    setKeywordState(keyword || "");
    setCategoryState(category || "");
  }, [keyword]);

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

          <ModalPage
            pageParams="movie"
            setPageOpen={setIsMovieOpen}
            setSelectedPage={setSelectedMovie}
            selectedPage={selectedMovie}
            isPageOpen={isMovieOpen}
            pageFrom={`/search?category=${categoryState}&keyword=${keywordState}`}
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
            pageFrom={`/search?category=${categoryState}&keyword=${keywordState}`}
          >
            {selectedPerson !== null && (
              <PersonDetailPage personId={selectedPerson} />
            )}
          </ModalPage>

          {hasMore && !loading && <div ref={observerRef}></div>}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
