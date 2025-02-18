import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFetchActorInfo } from "../apis/search";

interface Actor {
  name: string;
  known_for_department: string;
  // 추가로 필요한 배우 정보 필드를 여기에 정의
}

const SearchPage = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  console.log("actor ", actor);
  const getActorData = async (keyword: string) => {
    setLoading(true);
    try {
      const response = await getFetchActorInfo(keyword);

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
      getActorData(keyword);
    }
  }, [keyword]);

  // useEffect(() => {
  //   if (keyword) {
  //     setLoading(true);
  //     getFetchActorInfo(keyword)
  //       .then((data) => {
  //         setActor(data); // 데이터가 있으면 actor 상태에 저장
  //       })
  //       .catch((err) => {
  //         setError("배우 정보를 가져오는데 실패했습니다.");
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [keyword]);

  return (
    <>
      <div>
        <h2>{keyword}로 검색한 결과 입니다.</h2>
        {loading && <p>로딩 중...</p>}
        {actor ? (
          <div>
            <h2>{actor.name}</h2>
          </div>
        ) : (
          !loading && <p>검색된 결과가 없습니다.</p>
        )}
      </div>
    </>
  );
};

export default SearchPage;
