import { useNavigate } from "react-router";
import { getFetchUserLogout } from "../apis/login";
import HeaderIcon from "../icons/HeaderIcon";
import useLoginStore from "../store/useStore";
import { ChangeEvent, useEffect, useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import DefaultUserIcon from "../icons/DefaultUserIcon";
import { useForm } from "react-hook-form";
import UseDebounce from "../hooks/useDebounce";

interface SearchForm {
  keyword: string;
}

const Header = () => {
  const { IsLogin, logout } = useLoginStore();
  const navigator = useNavigate();

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
  const [category, setCategory] = useState<string>("영화");
  const handleChangeValue = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
  };

  // 검색
  const { register, handleSubmit, watch, setValue } = useForm<SearchForm>();
  const keyword = watch("keyword");
  const debounceKeyword = UseDebounce(keyword, 500);

  const onValid = (data: SearchForm) => {
    navigator(`/search?keyword=${data.keyword}`);
  };

  useEffect(() => {
    if (debounceKeyword) {
      navigator(`/search?keyword=${debounceKeyword}`);
    } else {
      navigator("/");
    }
  }, [debounceKeyword]);

  return (
    <header className="sticky top-0 z-5 bg-white ">
      <div className="flex justify-center items-center border-b border-slate-300">
        <div className="flex justify-between items-center gap-8 px-8 py-2 h-16 w-[1280px]">
          <div className="">
            <button onClick={() => navigator("/")}>
              <HeaderIcon className="w-30 h-10 hover:cursor-pointer" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onValid)}
            className="relative flex items-center w-96 border border-gray-300 rounded-lg overflow-hidden"
          >
            <select
              value={category}
              onChange={handleChangeValue}
              className="p-1 bg-gray-200 border-r border-gray-300 outline-none hover:cursor-pointer"
            >
              <option value="movie">영화</option>
              <option value="actor">배우</option>
            </select>
            <input
              {...register("keyword", { required: true, minLength: 2 })}
              className="flex-1 p-1 outline-none"
              placeholder="검색어를 입력하세요"
            />
            {keyword && (
              <button
                onClick={() => setValue("keyword", "")}
                className="hover:cursor-pointer"
              >
                x
              </button>
            )}
            <button type="submit">
              <SearchIcon className="w-8 h-6 hover:cursor-pointer" />
            </button>
          </form>
          <div>
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
          </div>
          <div>{IsLogin ? <DefaultUserIcon /> : ""}</div>
        </div>
      </div>
    </header>
  );
};
export default Header;
