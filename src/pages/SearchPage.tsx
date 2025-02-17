import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  return (
    <>
      <div>
        <div>{keyword}로 검색한 결과 입니다.</div>
      </div>
    </>
  );
};

export default SearchPage;
