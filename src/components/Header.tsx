import { useLocation, useNavigate, useSearchParams } from "react-router";
import { getFetchUserLogout } from "../apis/login";
import HeaderIcon from "../icons/HeaderIcon";
import useLoginStore from "../store/useStore";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import DefaultUserIcon from "../icons/DefaultUserIcon";
import { useForm } from "react-hook-form";
import UseDebounce from "../hooks/useDebounce";
import Select from "@ui/Select";

type SelectedItem = {
  label: ReactNode;
  value: string;
};

interface SearchForm {
  keyword: string;
}

const Header = () => {
  const { IsLogin, logout } = useLoginStore();
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const handleClickMain = () => {
    navigator("/");
    setKeyword("");
  };

  const handleLogoutFetch = async () => {
    try {
      const { result } = await getFetchUserLogout();
      if (result) {
        logout();
        navigator("/login", { replace: true });
      }
    } catch (e) {}
  };

  // 검색 카테고리
  const [category, setCategory] = useState<string>("movie");
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    label: "영화",
    value: "movie",
  });

  // 검색
  const [searchParams, setSearchParams] = useSearchParams();
  // const { register, handleSubmit, watch, setValue } = useForm<SearchForm>();
  // const keyword = watch("keyword");
  const [keyword, setKeyword] = useState<string>("");
  const URLkeyword = searchParams.get("keyword") ?? "";
  const hasSearchParams = searchParams.toString().length === 0;
  const debounceKeyword = UseDebounce(keyword, 500);
  console.log("URLkeyword ", URLkeyword);
  console.log("keyword ", keyword);

  // const onValid = (data: SearchForm) => {
  //   navigator(`/search?category=${category}&keyword=${data.keyword}`);
  // };

  const onSubmitSearch = () => {
    if (keyword) {
      navigator(`/search?category=${category}&keyword=${keyword}`);
    }
  };

  /* 조건 
  1. 검색어 지우면 메인으로 네비
  2. 검색결과 말고 다른페이지 들어갔을 때 메인으로 네비되면 안됨
  3. 검색어 다 지웠을 때 url에 검색어도 다 지워져야 함
  4. 검색결과 url 다른 탭에서 들어갔을 때 결과 그대로 나와야함 */

  useEffect(() => {
    if (debounceKeyword) {
      navigator(`/search?category=${category}&keyword=${debounceKeyword}`);
    } /* else {
      setSearchParams({});
    } */
  }, [debounceKeyword]);

  return (
    <header className="top-0 z-5 bg-white ">
      <div className="flex justify-center items-center border-b border-slate-300">
        <div className="flex justify-between items-center gap-8 px-8 py-2 h-16 w-[1280px]">
          <div className="">
            <button onClick={handleClickMain}>
              <HeaderIcon className="w-30 h-10 hover:cursor-pointer" />
            </button>
          </div>
          <form
            onSubmit={onSubmitSearch}
            className="relative flex items-center w-96 border border-gray-300 rounded-lg overflow-hidden"
          >
            <Select
              value={category}
              onChange={setCategory}
              item={selectedItem}
              setItem={setSelectedItem}
              className="relative p-1 border-r border-gray-300 hover:cursor-pointer"
            >
              <Select.Trigger className="w-full px-3 py-1 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:outline-none" />
              <Select.Content className="p-3 mt-2 bg-white border border-gray-300 rounded-md z-5 ">
                <Select.Item className="hover:cursor-pointer" value="movie">
                  영화
                </Select.Item>
                <Select.Item className="hover:cursor-pointer" value="actor">
                  배우
                </Select.Item>
              </Select.Content>
            </Select>
            {/* <input
              {...register("keyword", { required: true, minLength: 2 })}
              className="flex-1 p-1 outline-none"
              placeholder="검색어를 입력하세요"
            /> */}
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 p-1 outline-none"
              placeholder="검색어를 입력하세요"
            />
            {/* {keyword && (
              <button
                onClick={() => setValue("keyword", "")}
                className="hover:cursor-pointer"
              >
                x
              </button>
            )} */}
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="hover:cursor-pointer"
              >
                x
              </button>
            )}
            <button type="submit">
              <SearchIcon className="w-8 h-6 hover:cursor-pointer" />
            </button>
          </form>
          <div className="flex gap-4">
            {IsLogin ? (
              <button
                onClick={handleLogoutFetch}
                className="hover:cursor-pointer"
              >
                로그아웃
              </button>
            ) : (
              <div
                onClick={() => navigator("/login")}
                className="hover:cursor-pointer"
              >
                로그인
              </div>
            )}
            <div>{IsLogin ? <DefaultUserIcon /> : ""}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
