import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import TabContainer from "../components/mypage/TabContainer";
import profileImg from "/images/profileImg.png";
import profileEdit from "/images/profileEdit.png";
import profileEdit2 from "/images/profileEdit2.png";
import { useEffect, useState } from "react";
import { baseInstance } from "../apis/axios.config";

interface UserProfile {
  userId: string;
  email: string;
  nickname: string;
  introduce: string;
  profileImg?: string;
}

const MyPage = () => {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(
    null
  );
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const loggedInUserName = profile?.nickname;
  console.log("loggedInUserName", loggedInUserName);

  /* 프로필 조회 */
  const getProfileData = async () => {
    try {
      const response = await baseInstance.get(`/mypage/profile/${nickname}`);

      if (response.status === 200) {
        setProfile(response.data); // profile 객체 한 번에 저장
        setOriginalProfile(response.data);
        setIsOwnProfile(loggedInUserName === nickname);
        console.log("profile", profile);
      }
    } catch (err) {
      console.error("프로필 조회 실패:", err);
    }
  };

  /* 프로필 수정 */
  const updateProfileData = async () => {
    if (!profile || !originalProfile) return;
    if (
      profile.nickname === originalProfile.nickname &&
      profile.introduce === originalProfile.introduce
    ) {
      console.log("변경된 내용 없음, API 요청 생략");
      return;
    }
    console.log("1", profile.nickname);
    console.log("2", originalProfile.nickname);
    console.log("3", profile.introduce);
    console.log("4", originalProfile.nickname);

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

  useEffect(() => {
    if (profile && !isEditing) {
      setIsOwnProfile(true);
    }
  }, [profile, isEditing]);

  useEffect(() => {
    getProfileData();
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
        <div className="w-full border border-[#DFDFDF] rounded-2xl">
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
            {!isOwnProfile && <Button className=" mt-6">팔로우</Button>}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4">
            <p className="">팔로워</p>
            <p>110명</p>
            <Button className="!w-[80%] bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400">
              팔로워 보기
            </Button>
          </div>
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4">
            <p className="">팔로잉</p>
            <p>80명</p>
            <Button className="!w-[80%] bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400">
              팔로잉 보기
            </Button>
          </div>
        </div>
      </div>
      <TabContainer />
    </div>
  );
};

export default MyPage;
