import { baseInstance } from "./axios.config";

export const deleteFetchUser = async (emails: string[]) => {
  console.log("emails: ", emails.join(","));
  if (!emails || emails.length === 0) {
    throw new Error("삭제할 이메일을 제공해야 합니다.");
  }
  try {
    const response = await baseInstance.delete(
      `/admin/users?emails=${emails.join(",")}`
    );

    return response;
  } catch (err) {
    console.error("유저 삭제 실패", err);
    throw new Error("유저 삭제하는 중 오류가 발생했습니다.");
  }
};
