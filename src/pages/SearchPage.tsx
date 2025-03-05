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
  const {
    movies,
    setMovies,
    page,
    setPage,
    keywordState,
    setKeywordState,
    categoryState,
    setCategoryState,
    people,
    peopleWithMovie,
    setPeople,
    setPeopleWithMovie,
  } = useSearchStore();

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [baseRect, _] = useState(new DOMRect());
  const [hasMore, setHasMore] = useState(true);
  const [responseTotalCount, setResponseTotalCount] = useState(0);
  console.log(responseTotalCount);
  const personRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");

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
    if (isMovieOpen || isPersonOpen || loading || !categoryState || !hasMore)
      return;
    if (isHangulConsonantPattern.test(keywordState)) return;
    if (!keywordState.trim()) return;

    try {
      setLoading(true);
      if (categoryState === "movie") {
        const response = await getFetchMovieInfo(keywordState, page);

        setResponseTotalCount(response.totalCount);
        setHasMore(response.hasMore);

        setMovies((prevMovies) => {
          const prevMovieIds = new Set(
            prevMovies.map((movie) => movie.movieId)
          );
          const newMovies = response.movies.filter(
            (movie: Movie) => !prevMovieIds.has(movie.movieId)
          );
          return page === 1 ? newMovies : [...prevMovies, ...newMovies];
        });

        setPeople([]);
      } else if (categoryState === "person") {
        const response = await getFetchPeopleInfo(keywordState, page);

        setHasMore(response.hasMore);
        setResponseTotalCount(response.totalPages);
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
        setMovies([]);
      }

      setPage((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const { setTargetRef } = useInfinite(trigger, [page]);

  useEffect(() => {
    if (isMovieOpen || isPersonOpen) return;

    if (keywordState !== keyword || categoryState !== category) {
      setKeywordState(keyword || "");
      if (category !== null) {
        setCategoryState(category);
      }
    }
  }, [keyword, category, isMovieOpen, isPersonOpen]);

  useEffect(() => {
    // keyword가 null일 경우 keywordState로 설정
    if (!keyword && keywordState) {
      setKeywordState(keywordState);
    }
  }, [keyword, keywordState]);

  useEffect(() => {
    if (observerRef) {
      setTargetRef(observerRef);
    }
  }, [observerRef]);

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
