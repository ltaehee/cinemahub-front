import { baseInstance } from "./axios.config";

export const updateUser = async (emails: string[]) => {
  if (!emails || emails.length === 0) {
    throw new Error("삭제할 이메일을 제공해야 합니다.");
  }
  try {
    const response = await baseInstance.patch(
      `/admin/users?emails=${emails.join(",")}`
    );

    return response;
  } catch (err) {
    console.error("유저 삭제 실패", err);
    throw new Error("유저 삭제하는 중 오류가 발생했습니다.");
  }
};

export const getFetchUser = async (page: number, limit: number) => {
  try {
    const response = await baseInstance.get(
      `/admin/users?page=${page}&limit=${limit}`
    );

    return response;
  } catch (err) {
    console.error("유저 조회 실패", err);
    throw new Error("유저 조회하는 중 오류가 발생했습니다.");
  }
};

// 전체 신고 리뷰 조회
export const getReportedReview = async (page: number, limit: number) => {
  try {
    const response = await baseInstance.get(
      `/admin/review?page=${page}&limit=${limit}`
    );
    return response;
  } catch (err) {
    console.error("신고된 리뷰 조회 실패", err);
    throw new Error("신고 리뷰 조회하는 중 오류가 발생했습니다.");
  }
};
