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
