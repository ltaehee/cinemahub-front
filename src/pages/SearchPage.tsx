import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { getFetchActorInfo } from "../apis/search";
import axios from "axios";

interface Actor {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string;
  known_for: [
    // 작품활동
    {
      backdrop_path: string;
      poster_path: string;
      id: number;
      name: string;
      popularity: number;
    }
  ];
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [actor, setActor] = useState<Actor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const category = searchParams.get("category") ?? "movie";

  console.log("actor ", actor);

  const getFetchData = async (keyword: string) => {
    setLoading(true);
    try {
      let response;
      if (category === "movie") {
        response = await axios.get("/아직 백엔드 작성중");
      } else {
        response = await getFetchActorInfo(keyword);
      }

      if (response) {
        setActor(response);
      } else {
        console.error("배우 정보를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("검색 오류: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      getFetchData(keyword);
    }
  }, [keyword]);

  return (
    <>
      <div>
        <div className="mt-3 ">
          <h2 className="flex flex-col items-center">
            {keyword}(으)로 검색한 결과 입니다.
          </h2>
          {loading && <p>로딩 중...</p>}

          <div className="flex justify-center items-center gap-5 mt-5">
            {actor
              ? actor.map((person) => (
                  <div key={person.id}>
                    <h3 className="text-xl font-bold">{person.name}</h3>
                  </div>
                ))
              : !loading && <p>검색된 결과가 없습니다.</p>}
          </div>

          <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {actor
              ? actor
                  .flatMap((person) => person.known_for)
                  .map((movie) => (
                    <div key={movie.id} className="flex justify-center">
                      <div className="flex flex-col items-center">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.name}
                          className="w-full h-80 shadow-lg"
                        />
                      </div>
                    </div>
                  ))
              : !loading && <p>검색된 결과가 없습니다.</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
