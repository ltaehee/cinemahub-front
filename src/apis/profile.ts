import { AxiosError } from "axios";
import { baseInstance } from "./axios.config";

/* 로그인한 유저 프로필 조회 */
export const getLoggedInUserInfo = async () => {
  try {
    const response = await baseInstance.get(`/profile/me`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("로그인한 유저 정보 가져오기 실패:", error);
    throw new Error("로그인한 유저 정보 가져오는 중 오류가 발생했습니다.");
  }
};

/* 닉네임 중복 체크 */
export const getFetchNicknameCheck = async (nickname: string) => {
  try {
    const response = await baseInstance.post("/profile/check-name", {
      nickname,
    });

    if (response.data.isError) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};
