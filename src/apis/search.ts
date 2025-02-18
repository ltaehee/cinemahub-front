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
  }
};
