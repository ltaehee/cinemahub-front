import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import profileImg from "/images/profileImg.png";
import profileEdit from "/images/profileEdit.png";
import profileEdit2 from "/images/profileEdit2.png";
import { useEffect, useState } from "react";
import { baseInstance } from "../apis/axios.config";
import Modal from "@ui/Modal";
import FollowSection from "../components/profilepage/FollowSection";
import TabContainer from "../components/profilepage/TabContainer";

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
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loggedInUserNickname, setLoggedInUserNickname] = useState<string>("");
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  /* 모달 */
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  /* 로그인한 유저 프로필 조회 */
  const getLoggedInUserInfo = async () => {
    try {
      const response = await baseInstance.get(`/profile/me`);
      if (response.status === 200) {
        setLoggedInUserNickname(response.data.nickname);
      }
    } catch (error) {
      console.error("로그인한 유저 정보 가져오기 실패:", error);
    }
  };

  /* url에 나온 닉네임 기준 프로필 조회 */
  const getProfileData = async () => {
    try {
      const response = await baseInstance.get(`/profile/${nickname}`);

      if (response.status === 200) {
        const profileData = response.data;

        // 팔로우 상태 추가: 현재 유저가 팔로우하고 있는 사람 목록
        const followingNicknames = profileData.following.map(
          (user: { nickname: string }) => user.nickname
        );

        const updatedFollowers = profileData.followers.map(
          (user: { nickname: string }) => ({
            ...user,
            isFollowing: followingNicknames.includes(user.nickname),
          })
        );

        const updatedFollowing = profileData.following.map(
          (user: { nickname: string }) => ({
            ...user,
            isFollowing: true, // 팔로잉 목록에는 무조건 isFollowing이 true
          })
        );
        setProfile({
          ...profileData,
          followers: updatedFollowers,
          following: updatedFollowing,
        });
        console.log("현재 페이지 유저 프로필", profile);
        setOriginalProfile(response.data);
        setIsOwnProfile(response.data.isOwnProfile);
        setIsFollowing(response.data.isFollowing);
      }
    } catch (err) {
      console.error("프로필 조회 실패:", err);
    }
  };

  /* 프로필 수정 */
  const updateProfileData = async () => {
    if (!profile || !originalProfile || !isOwnProfile) return;
    if (
      profile.nickname === originalProfile.nickname &&
      profile.introduce === originalProfile.introduce
    ) {
      console.log("변경된 내용 없음, API 요청 생략");
      return;
    }

    try {
      const response = await baseInstance.patch("/profile/profile-update", {
        name: profile.nickname,
        intro: profile.introduce,
      });
      setOriginalProfile({ ...profile });
      if (profile.nickname !== originalProfile.nickname) {
        navigate(`/profile/${profile.nickname}`);
      }
      console.log("프로필 업데이트 성공", response.data);
    } catch (error) {
      console.error("프로필 업데이트 오류", error);
    }
  };

  /* 프로필 수정 버튼 */
  const handleEditClick = () => {
    if (isEditing) {
      updateProfileData();
    }
    setIsEditing(!isEditing);
  };

  /* 팔로우 요청 */
  const handleFollow = async (targetNickname: string) => {
    try {
      await baseInstance.post(`/follow/${targetNickname}`);
      getProfileData();
      console.log("팔로우 성공", targetNickname);
    } catch (error) {
      console.error("팔로우 요청 오류:", error);
    }
  };
  /* 언팔로우 요청 */
  const handleUnfollow = async (targetNickname: string) => {
    try {
      await baseInstance.delete(`/follow/${targetNickname}`);
      getProfileData();
      console.log("언팔로우 성공", targetNickname);
    } catch (error) {
      console.error("언팔로우 요청 오류:", error);
    }
  };
  useEffect(() => {
    getProfileData();
  }, [nickname]);

  useEffect(() => {
    getLoggedInUserInfo();
    console.log("my Nickname", loggedInUserNickname);
  }, []);

  if (!profile) {
    return;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1280px] flex gap-2 mt-10 mb-20">
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
            {!isOwnProfile && !isFollowing && (
              <div className="w-full px-12">
                <Button onClick={() => handleFollow(profile.nickname)}>
                  팔로우
                </Button>
              </div>
            )}
            {!isOwnProfile && isFollowing && (
              <div className="w-full px-12">
                <Button
                  onClick={() => handleUnfollow(profile.nickname)}
                  className="bg-gray-500 hover:bg-gray-400"
                >
                  언팔로우
                </Button>
              </div>
            )}
          </div>
        </div>

        <FollowSection
          profile={profile}
          loggedInUserNickname={loggedInUserNickname}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      </div>

      <TabContainer />
    </div>
  );
};

export default ProfilePage;
