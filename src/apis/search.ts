import { baseInstance } from "./axios.config";

// 배우Id로 검색
export const getFetchActorInfo = async (actorName: string) => {
  console.log("actorName: ", actorName);
  try {
    const response = await baseInstance.get(`/search/actor?name=${actorName}`);

    if (response.data.isError) {
      throw new Error(response.data.message);
    }
    // console.log("배우정보: ", response.data);
    return response.data;
  } catch (err) {
    console.error("배우정보를 가져오는데 실패했습니다.", err);
    throw new Error("배우정보를 불러오는 중 오류가 발생했습니다.");
  }
};

// 검색어로 영화정보 검색
export const getFetchMovieInfo = async (MovieName: string) => {
  try {
    const response = await baseInstance.get(
      `/search/movie?keyword=${MovieName}`
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
