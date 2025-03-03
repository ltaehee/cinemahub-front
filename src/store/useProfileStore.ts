// src/store/useProfileStore.ts
import { create } from "zustand";
import { getLoggedInUserInfo, getProfileData } from "../apis/profile";

export interface UserProfile {
  userId: string;
  email: string;
  nickname: string;
  introduce: string;
  profile?: string;
  following: { nickname: string }[];
}

interface ProfileStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  fetchProfile: (nickname: string) => Promise<void>;
  getProfile: () => Promise<void>;
}

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,

  //  프로필 상태 업데이트
  setProfile: (profile) => set({ profile }),

  // 프로필 데이터 가져오기
  fetchProfile: async (nickname) => {
    try {
      const profileData = await getProfileData(nickname);
      set({ profile: profileData });
    } catch (error) {
      console.error("프로필 데이터 가져오기 오류:", error);
    }
  },

  getProfile: async () => {
    try {
      const userInfo = await getLoggedInUserInfo();
      set({ profile: userInfo });
    } catch (err) {
      console.error("프로필 데이터 가져오기 오류:", err);
    }
  },
}));

export default useProfileStore;
