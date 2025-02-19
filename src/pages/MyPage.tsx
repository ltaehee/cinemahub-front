import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import TabContainer from "../components/mypage/TabContainer";
import profileImg from "/images/profileImg.png";
import profileEdit from "/images/profileEdit.png";
import profileEdit2 from "/images/profileEdit2.png";
import { useEffect, useState } from "react";
import { baseInstance } from "../apis/axios.config";
import FollowSection from "../components/mypage/FollowSection";

const followerList = [
  { nickname: "닉네임1", email: "test1@naver.com", profileImg: "" },
  { nickname: "닉네임2", email: "test2@naver.com", profileImg: "" },
  { nickname: "닉네임3", email: "test3@naver.com", profileImg: "" },
];

const followingList = [
  { nickname: "팔로잉1", email: "follow1@naver.com", profileImg: "" },
  { nickname: "팔로잉2", email: "follow2@naver.com", profileImg: "" },
];

interface UserProfile {
  userId: string;
  email: string;
  nickname: string;
  introduce: string;
  profileImg?: string;
}

const MyPage = () => {
  const { nickname } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(
    null
  );
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const navigate = useNavigate();

  /* 프로필 조회 */
  const getProfileData = async () => {
    try {
      const response = await baseInstance.get(`/mypage/profile/${nickname}`);

      if (response.status === 200) {
        setProfile(response.data); // 프로필 데이터 저장
        setOriginalProfile(response.data);
        setIsOwnProfile(response.data.isOwnProfile); // 백엔드에서 받아온 값 사용
        console.log("Rwds", response.data);
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
      const response = await baseInstance.patch("/mypage/profile-update", {
        name: profile.nickname,
        intro: profile.introduce,
      });
      setOriginalProfile({ ...profile });
      if (profile.nickname !== originalProfile.nickname) {
        navigate(`/mypage/${profile.nickname}`);
      }
      console.log("프로필 업데이트 성공", response.data);
    } catch (error) {
      console.error("프로필 업데이트 오류", error);
    }
  };

  /* useEffect(() => {
    if (profile && !isEditing) {
      setIsOwnProfile(loggedInUserName === nickname);
    }
  }, [profile, loggedInUserName, nickname, isEditing]); */

  useEffect(() => {
    getProfileData();
    console.log("profile", profile);
    console.log("isOwnProfile", isOwnProfile);
  }, []);

  const handleEditClick = () => {
    if (isEditing) {
      updateProfileData();
    }
    setIsEditing(!isEditing);
  };

  if (!profile) {
    return;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1280px] flex gap-2 mt-10 mb-20">
        <div className="w-full  border border-[#DFDFDF] rounded-2xl">
          <div className="w-full relative flex flex-col gap-2 items-center p-2 ">
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
            {!isOwnProfile && (
              <div className="w-full px-12">
                <Button className="">팔로우</Button>
              </div>
            )}
          </div>
        </div>
        {/* <div className="w-full flex flex-col gap-2">
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4 px-12">
            <p className="font-semibold">팔로워</p>
            <p className="font-bold text-2xl py-4">110명</p>
            <Button className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400">
              팔로워 보기
            </Button>
          </div>
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4 px-12">
            <p className="font-semibold">팔로잉</p>
            <p className="font-bold text-2xl py-4">80명</p>
            <Button className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400">
              팔로잉 보기
            </Button>
          </div>
        </div> */}
        <FollowSection
          followerCount={followerList.length}
          followingCount={followingList.length}
          followerList={followerList}
          followingList={followingList}
        />
      </div>

      <TabContainer />
    </div>
  );
};

export default MyPage;
