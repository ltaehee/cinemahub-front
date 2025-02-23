import { useLocation, useNavigate, useSearchParams } from "react-router";
import { getFetchUserLogout } from "../apis/login";
import useLoginStore from "../store/useStore";
import { ReactNode, useEffect, useState } from "react";
import DefaultUserIcon from "../icons/DefaultUserIcon";
import { useForm } from "react-hook-form";
import UseDebounce from "../hooks/useDebounce";
import Select from "@ui/Select";
import LogoIcon from "../icons/LogoIcon";
import XIcon from "../icons/XIcon";
import { getLoggedInUserInfo } from "../apis/profile";

type SelectedItem = {
  label: ReactNode;
  value: string;
};

interface SearchForm {
  keyword: string;
}

const Header = () => {
  const { IsLogin, logout } = useLoginStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClickMain = () => {
    navigate("/");
    setValue("keyword", "");
  };

  const handleLogoutFetch = async () => {
    try {
      const { result } = await getFetchUserLogout();
      if (result) {
        logout();
        navigate("/login", { replace: true });
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
  const [searchParams, _] = useSearchParams();
  const { register, handleSubmit, watch, setValue } = useForm<SearchForm>();
  const keyword = watch("keyword");
  const urlKeyword = searchParams.get("keyword") ?? "";
  const urlCategory = searchParams.get("category") ?? "";
  const debounceKeyword = UseDebounce(keyword, 500);

  const onValid = (data: SearchForm) => {
    navigate(`/search?category=${category}&keyword=${data.keyword}`);
  };

  // 프로필이미지 선택 시 프로필페이지로 이동
  const handleClickProfile = async () => {
    try {
      const response = await getLoggedInUserInfo();
      console.log(response);
      navigate(`/profile/${response.nickname}`);
    } catch (err) {
      console.error("로그인한 유저 정보 가져오기 실패: ", err);
    }
  };

  useEffect(() => {
    if (debounceKeyword) {
      navigate(`/search?category=${category}&keyword=${debounceKeyword}`);
    } else if (pathname === "/search") {
      navigate("/");
    }
  }, [debounceKeyword]);

  useEffect(() => {
    if (urlKeyword) {
      setValue("keyword", urlKeyword);
    }
  }, [urlKeyword]);

  useEffect(() => {
    if (urlCategory === "person") {
      setCategory("person");
      setSelectedItem({ label: "영화인", value: "person" });
    }
  }, [urlCategory]);

  return (
    <header className="top-0 z-3 bg-white sticky">
      <div className="flex justify-center items-center border-b border-slate-300 px-8">
        <div className="flex justify-between items-center gap-8 px-8 py-2 h-16 w-[1280px]">
          <div className="flex items-center">
            <button onClick={handleClickMain}>
              <LogoIcon className="h-5 hover:cursor-pointer" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onValid)}
            className="relative flex items-center w-full border border-gray-300 rounded-lg overflow-hidden"
          >
            <Select
              value={category}
              onChange={setCategory}
              item={selectedItem}
              setItem={setSelectedItem}
              className="z-4 p-1 border-r border-gray-300 hover:cursor-pointer sticky"
            >
              <Select.Trigger className="w-full px-3 py-1 text-gray-700 hover:text-gray-950 focus:ring-2 focus:outline-none cursor-pointer" />
              <Select.Content className="p-3 mt-2 bg-white border border-gray-300 rounded-md z-5 cursor-pointer">
                <Select.Item className="pb-1" value="movie">
                  영화
                </Select.Item>
                <Select.Item value="person">영화인</Select.Item>
              </Select.Content>
            </Select>
            <input
              {...register("keyword", { required: true, minLength: 2 })}
              className="flex-1 px-3 py-1 outline-none"
              placeholder="검색어를 입력하세요"
            />
            {keyword && (
              <button
                onClick={() => setValue("keyword", "")}
                className="hover:cursor-pointer"
              >
                <XIcon fill="#555" className="w-3 mr-3" />
              </button>
            )}
          </form>
          <div className="flex gap-4 text-sm text-gray-500">
            {IsLogin ? (
              <button
                onClick={handleLogoutFetch}
                className="hover:cursor-pointer text-nowrap"
              >
                로그아웃
              </button>
            ) : (
              <div
                onClick={() => navigate("/login")}
                className="hover:cursor-pointer text-nowrap"
              >
                로그인
              </div>
            )}
            <div>
              {IsLogin ? (
                <DefaultUserIcon
                  onClick={handleClickProfile}
                  className="w-10 hover:cursor-pointer"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
