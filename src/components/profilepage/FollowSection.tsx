import { useEffect, useState } from "react";
import Button from "../Button";
import profileImg from "/images/profileImg.png";
import closeImg from "/images/close.png";
import { useNavigate } from "react-router-dom";
import useLoginStore from "../../store/useStore";

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
  loggedInUserProfile?: UserProfile | null; // 현재 로그인한 유저 정보 추가
  handleFollow: (nickname: string) => void;
  handleUnfollow: (nickname: string) => void;
}

const FollowSection = ({
  profile,
  handleFollow,
  handleUnfollow,
  loggedInUserProfile,
}: FollowSectionProps) => {
  const { followers, following } = profile;

  const [view, setView] = useState<"follower" | "following" | null>(null);
  const navigate = useNavigate();
  const { IsLogin } = useLoginStore();
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [loggedUserProfile, setLoggedUserProfile] =
    useState<UserProfile | null>(loggedInUserProfile || null);

  // 현재 로그인한 유저가 팔로잉하고 있는 닉네임 리스트 추출
  const followingNicknames =
    loggedUserProfile?.following.map((user) => user.nickname) || [];

  const handleFollowClick = async (nickname: string) => {
    if (isDebouncing) return;
    setIsDebouncing(true);

    try {
      handleFollow(nickname);
      setLoggedUserProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          following: [
            ...prev.following,
            { nickname, email: "", profileImg: "" },
          ],
        };
      });
    } catch (error) {
      console.error("팔로우 요청 오류:", error);
    } finally {
      setTimeout(() => setIsDebouncing(false), 1000);
    }
  };

  const handleUnfollowClick = async (nickname: string) => {
    if (isDebouncing) return;
    setIsDebouncing(true);

    try {
      handleUnfollow(nickname);
      setLoggedUserProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          following: prev.following.filter(
            (following) => following.nickname !== nickname
          ),
        };
      });
    } catch (error) {
      console.error("언팔로우 요청 오류:", error);
    } finally {
      setTimeout(() => setIsDebouncing(false), 1000);
    }
  };
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
              (user, index) => {
                // 현재 user.nickname이 로그인한 유저의 팔로잉 리스트에 포함되어 있는지 확인
                const isFollowing = followingNicknames.includes(user.nickname);

                return (
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

                    {/* 로그인 안 했을 때 */}
                    {!IsLogin && (
                      <Button
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        팔로우
                      </Button>
                    )}

                    {/* 로그인 했을 때 */}
                    {IsLogin &&
                      user.nickname !== loggedInUserProfile?.nickname && (
                        <Button
                          onClick={() =>
                            isFollowing
                              ? handleUnfollowClick(user.nickname)
                              : handleFollowClick(user.nickname)
                          }
                          disabled={isDebouncing}
                          className={`${
                            isFollowing ? "bg-gray-500 hover:bg-gray-400" : ""
                          }`}
                        >
                          {isDebouncing ? (
                            <div className="flex justify-center items-center">
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                            </div>
                          ) : isFollowing ? (
                            "언팔로우"
                          ) : (
                            "팔로우"
                          )}
                        </Button>
                      )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowSection;
