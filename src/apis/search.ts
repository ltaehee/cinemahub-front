import { emptyChecker } from "../util/emptyCheck";
import { baseInstance } from "./axios.config";

// 배우Id로 검색
export const getFetchPeopleInfo = async (peopleName: string, page: number) => {
  if (emptyChecker({ peopleName })) {
    alert("배우,감독명을 입력해 주세요");
    return;
  }

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
  if (emptyChecker({ MovieName })) {
    alert("영화명을 입력해 주세요");
    return;
  }

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
export const getFetchUserInfo = async (
  keyword: string,
  page: number,
  limit: number
) => {
  if (emptyChecker({ keyword })) {
    alert("유저이름을 입력해 주세요");
    return;
  }
  try {
    const response = await baseInstance.get(
      `/search/user?keyword=${keyword}&page=${page}&limit=${limit}`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("검색된 유저가 없습니다.");
    }

    console.log("유저정보: ", response);

    return response;
  } catch (err) {
    console.error("유저정보를 가져오는데 실패했습니다.", err);
    throw new Error("유저정보를 불러오는 중 오류가 발생했습니다.");
  }
};

// 신고리뷰 관련 정보검색
export const getFetchReviewInfo = async (
  keyword: string,
  page: number,
  limit: number
) => {
  if (emptyChecker({ keyword })) {
    alert("신고 리뷰 글을 입력해 주세요");
    return;
  }
  try {
    const response = await baseInstance.get(
      `/search/review?keyword=${keyword}&page=${page}&limit=${limit}`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("검색된 신고리뷰 관련 정보가 없습니다.");
    }

    console.log("신고리뷰 관련 정보: ", response);

    return response;
  } catch (err) {
    console.error("신고리뷰 관련 정보를 가져오는데 실패했습니다.", err);
    throw new Error("신고리뷰 관련 정보를 불러오는 중 오류가 발생했습니다.");
  }
};
