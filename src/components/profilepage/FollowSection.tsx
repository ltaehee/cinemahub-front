import { useEffect, useState } from "react";
import Button from "../Button";
import profileImg from "/images/profileImg.png";
import closeImg from "/images/close.png";
import { useNavigate } from "react-router-dom";

// FollowUser 타입 수정: isFollowing을 optional로 설정
interface FollowUser {
  nickname: string;
  email: string;
  profileImg?: string;
  isFollowing?: boolean;
}

interface UserProfile {
  userId: string;
  email: string;
  nickname: string;
  introduce: string;
  profileImg?: string;
  followers: FollowUser[];
  following: FollowUser[];
  favorites: { favoriteType: string; favoriteId: string }[];
}

interface FollowSectionProps {
  profile: UserProfile;
  loggedInUserNickname: string; // 현재 로그인한 유저 닉네임 추가
  handleFollow: (nickname: string) => void;
  handleUnfollow: (nickname: string) => void;
}

const FollowSection = ({
  profile,
  handleFollow,
  handleUnfollow,
  loggedInUserNickname,
}: FollowSectionProps) => {
  const { followers, following } = profile;

  const [view, setView] = useState<"follower" | "following" | null>(null);
  const navigate = useNavigate();
  console.log("loggedInUserNickname", loggedInUserNickname);
  console.log("Test", { profile });

  return (
    <div className="w-full">
      {view === null ? (
        <div className="w-full flex flex-col gap-2">
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4 px-12">
            <p className="font-semibold">팔로워</p>
            <p className="font-bold text-2xl py-4">{followers.length}명</p>
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => setView("follower")}
            >
              팔로워 보기
            </Button>
          </div>
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4 px-12">
            <p className="font-semibold">팔로잉</p>
            <p className="font-bold text-2xl py-4">{following.length}명</p>
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => setView("following")}
            >
              팔로잉 보기
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-[#DFDFDF] rounded-2xl p-4 w-full h-full ">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-xl font-bold">
              {view === "follower" ? "팔로워" : "팔로잉"}
            </h2>
            <button
              className="font-bold cursor-pointer"
              onClick={() => setView(null)}
            >
              <img className="w-8" src={closeImg} alt="닫기 버튼" />
            </button>
          </div>

          <div>
            {(view === "follower" ? followers : following).map(
              (user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2"
                >
                  <div
                    className="w-full flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${user.nickname}`);
                      setView(null);
                    }}
                  >
                    <img
                      src={user.profileImg || profileImg}
                      alt="프로필"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold">{user.nickname}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  {/* 현재 로그인한 유저와 비교하여 버튼 숨기기 */}
                  {user.nickname !== loggedInUserNickname && (
                    <Button
                      onClick={() =>
                        user.isFollowing
                          ? handleUnfollow(user.nickname)
                          : handleFollow(user.nickname)
                      }
                      className={`${
                        user.isFollowing ? "bg-gray-500 hover:bg-gray-400" : ""
                      }`}
                    >
                      {user.isFollowing ? "언팔로우" : "팔로우"}
                    </Button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowSection;
