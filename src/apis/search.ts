import { baseInstance } from "./axios.config";

// 배우Id로 검색
export const getFetchPeopleInfo = async (peopleName: string, page: number) => {
  console.log("peopleName: ", peopleName);
  try {
    const response = await baseInstance.get(
      `/search/people?name=${peopleName}&page=${page}`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("검색된 배우,감독이 없습니다.");
    }
    console.log("배우,감독정보: ", response.data);
    return response.data;
  } catch (err) {
    console.error("배우정보를 가져오는데 실패했습니다.", err);
    throw new Error("배우정보를 불러오는 중 오류가 발생했습니다.");
  }
};

// 검색어로 영화정보 검색
export const getFetchMovieInfo = async (MovieName: string, page: number) => {
  try {
    const response = await baseInstance.get(
      `/search/movie?keyword=${MovieName}&page=${page}`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("검색된 영화가 없습니다.");
    }

    console.log("영화정보: ", response.data);
    return response.data;
  } catch (err) {
    console.error("영화정보를 가져오는데 실패했습니다.", err);
    throw new Error("영화 정보를 불러오는 중 오류가 발생했습니다.");
  }
};

// 유저정보 검색
export const getFetchUserInfo = async (keyword: string) => {
  try {
    const response = await baseInstance.get(`/search/user?keyword=${keyword}`);

    if (!response.data || response.data.length === 0) {
      throw new Error("검색된 유저가 없습니다.");
    }

    console.log("유저정보: ", response.data);

    return response.data;
  } catch (err) {
    console.error("유저정보를 가져오는데 실패했습니다.", err);
    throw new Error("유저정보를 불러오는 중 오류가 발생했습니다.");
  }
};
