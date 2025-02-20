import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import profileImg from "/images/profileImg.png";
import profileEdit from "/images/profileEdit.png";
import profileEdit2 from "/images/profileEdit2.png";
import { useEffect, useState } from "react";
import FollowSection from "../components/profilepage/FollowSection";
import TabContainer from "../components/profilepage/TabContainer";
import useLoginStore from "../store/useStore";
import {
  followUser,
  getFetchNicknameCheck,
  getLoggedInUserInfo,
  getProfileData,
  unfollowUser,
  updateProfileData,
} from "../apis/profile";

interface UserProfile {
  userId: string;
  email: string;
  nickname: string;
  introduce: string;
  profileImg?: string;
  followers: { nickname: string; email: string; profileImg?: string }[];
  following: { nickname: string; email: string; profileImg?: string }[];
  favorites: { favoriteType: string; favoriteId: string }[];
}

const ProfilePage = () => {
  const { nickname } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(
    null
  );
  const [loggedInUserProfile, setLoggedInUserProfile] =
    useState<UserProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const navigate = useNavigate();
  const { IsLogin } = useLoginStore();

  /* 로그인한 유저 프로필 조회 */
  const fetchLoggedInUserInfo = async () => {
    const userInfo = await getLoggedInUserInfo();
    setLoggedInUserProfile(userInfo);
  };

  /* url에 나온 닉네임 기준 프로필 조회 */
  const fetchProfileData = async () => {
    const profileData = await getProfileData(nickname as string);
    setProfile(profileData);
    setOriginalProfile(profileData);
    setIsOwnProfile(profileData.isOwnProfile);
    setIsFollowing(profileData.isFollowing);
  };

  /* 닉네임 중복 체크 */
  const checkNicknameCheck = async (nickname: string) => {
    try {
      const { result } = await getFetchNicknameCheck(nickname);
      return result;
    } catch (error) {
      console.error("닉네임 중복 체크 오류:", error);
      return false;
    }
  };
  /* 프로필 수정 */
  const handleEditClick = async () => {
    if (isEditing) {
      // 닉네임 중복 체크
      const isUnique = await checkNicknameCheck(profile?.nickname || "");
      if (!isUnique) {
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력하세요.");
        return;
      }
      if (!profile) {
        return;
      }
      await updateProfileData(profile.nickname, profile.introduce);
      // 닉네임이 변경된 경우 URL도 수정
      if (originalProfile && profile.nickname !== originalProfile.nickname) {
        navigate(`/profile/${profile.nickname}`);
      }
    }
    setIsEditing(!isEditing);
  };

  /* 팔로우 요청 */
  const handleFollow = async (targetNickname: string) => {
    if (isDebouncing) return;
    setIsDebouncing(true);
    await followUser(targetNickname);
    fetchProfileData();
    setTimeout(() => setIsDebouncing(false), 1000);
  };

  /* 언팔로우 요청 */
  const handleUnfollow = async (targetNickname: string) => {
    if (isDebouncing) return;
    setIsDebouncing(true);
    await unfollowUser(targetNickname);
    fetchProfileData();
    setTimeout(() => setIsDebouncing(false), 1000);
  };
  useEffect(() => {
    fetchProfileData();
  }, [nickname]);

  useEffect(() => {
    fetchLoggedInUserInfo();
  }, []);
  if (!profile) {
    return;
  }
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1280px] flex gap-2 mt-10 mb-20 ">
        <div className="w-full  border border-[#DFDFDF] rounded-2xl">
          <div className="w-full relative flex flex-col gap-2 items-center p-2">
            <div className="w-full flex justify-end mb-4">
              {isOwnProfile ? (
                <img
                  src={isEditing ? profileEdit2 : profileEdit}
                  alt="프로필 수정 버튼"
                  className="w-8 cursor-pointer"
                  onClick={handleEditClick}
                />
              ) : null}
            </div>
            <img
              src={profile.profileImg || profileImg}
              alt="프로필 사진"
              className="w-30"
            />
            {isEditing ? (
              <div className="w-[90%]">
                <p>이름</p>
                <input
                  type="text"
                  value={profile.nickname}
                  onChange={(e) =>
                    setProfile({ ...profile, nickname: e.target.value })
                  }
                  className="border border-gray-400 w-full p-1 rounded"
                />
              </div>
            ) : (
              <p>{profile.nickname}</p>
            )}
            {!isEditing && <p className="text-gray-500">{profile.email}</p>}
            {isEditing ? (
              <div className="w-[90%]">
                <p>자기소개</p>
                <textarea
                  value={profile.introduce}
                  onChange={(e) =>
                    setProfile({ ...profile, introduce: e.target.value })
                  }
                  className="border border-gray-400 w-full p-1 rounded resize-none"
                />
              </div>
            ) : (
              <p className="text-gray-500">
                {profile.introduce || "자기소개를 해주세요"}
              </p>
            )}

            <div className="w-full px-12">
              {!IsLogin && (
                <Button
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  팔로우
                </Button>
              )}
              {!isOwnProfile && !isFollowing && IsLogin && (
                <Button onClick={() => handleFollow(profile.nickname)}>
                  {isDebouncing ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "팔로우"
                  )}
                </Button>
              )}
              {!isOwnProfile && isFollowing && (
                <Button
                  onClick={() => handleUnfollow(profile.nickname)}
                  className="bg-gray-500 hover:bg-gray-400"
                >
                  {isDebouncing ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "언팔로우"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        <FollowSection
          profile={profile}
          loggedInUserProfile={loggedInUserProfile}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      </div>

      <TabContainer />
    </div>
  );
};

export default ProfilePage;
