import { baseInstance } from "./axios.config";

/* Presigned URL 요청 */
export const getPresignedUrl = async (fileName: string) => {
  try {
    console.log("Requested fileName:", fileName);
    const response = await baseInstance.get(
      `/upload/presigned-url?fileName=${fileName}`
    );

    console.log("response.data.url", response.data.url);
    return response.data.url;
  } catch (error) {
    console.error("Presigned URL 요청 실패:", error);
    throw new Error("이미지 업로드 URL 요청 중 오류가 발생했습니다.");
  }
};

/* S3에 이미지 업로드 */
export const uploadImageToS3 = async (url: string, file: File) => {
  try {
    await baseInstance.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw new Error("이미지 업로드 중 오류가 발생했습니다.");
  }
};
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

/* 특정 닉네임의 프로필 조회 */
export const getProfileData = async (nickname: string) => {
  try {
    const response = await baseInstance.get(`/profile/${nickname}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("프로필 조회 실패:", error);
    throw new Error("프로필 조회 중 오류가 발생했습니다.");
  }
};

/* 닉네임 중복 체크 */
export const getFetchNicknameCheck = async (
  nickname: string,
  currentNickname: string
) => {
  try {
    const response = await baseInstance.post("/profile/check-nickname", {
      nickname,
      currentNickname,
    });

    if (response.data.isError) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    throw new Error("닉네임 체크중 오류가 발생했습니다.");
  }
};

/* 프로필 업데이트 */
export const updateProfileData = async (
  nickname: string,
  introduce: string,
  profile?: string
) => {
  try {
    const response = await baseInstance.patch("/profile/profile-update", {
      nickname,
      introduce,
      profile,
    });

    return response.data;
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    throw new Error("프로필 업데이트 중 오류가 발생했습니다.");
  }
};

/* 팔로우 요청 */
export const followUser = async (targetNickname: string) => {
  try {
    await baseInstance.post(`/follow/${targetNickname}`);
  } catch (error) {
    console.error("팔로우 요청 오류:", error);
    throw new Error("팔로우 요청 중 오류가 발생했습니다.");
  }
};

/* 언팔로우 요청 */
export const unfollowUser = async (targetNickname: string) => {
  try {
    await baseInstance.delete(`/follow/${targetNickname}`);
  } catch (error) {
    console.error("언팔로우 요청 오류:", error);
    throw new Error("언팔로우 요청 중 오류가 발생했습니다.");
  }
};

/* 프로필 페이지 리뷰 내역 조회 */
export const getUserReviewsAPI = async (
  nickname: string,
  page: number,
  limit: number
) => {
  try {
    const response = await baseInstance.get(
      `/review/user-reviews/${nickname}`,
      {
        params: {
          page,
          limit,
        },
      }
    );
    console.log("리뷰데이터", response.data);
    return response.data;
  } catch (error) {
    console.error("리뷰 조회 오류:", error);
    throw error;
  }
};

/* 팔로워 조회 */
export const getFollowersAPI = async (
  nickname: string,
  page: number,
  limit: number
) => {
  try {
    const response = await baseInstance.get(`/follow/followers/${nickname}`, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("팔로워 조회 실패:", error);
    throw new Error("팔로워 조회에 실패했습니다. 새로고침 해주세요.");
  }
};

/* 팔로잉 조회 */
export const getFollowingAPI = async (
  nickname: string,
  page: number,
  limit: number
) => {
  try {
    const response = await baseInstance.get(`/follow/following/${nickname}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("팔로잉 조회 실패:", error);
    throw new Error("팔로잉 조회에 실패했습니다. 새로고침 해주세요.");
  }
};
