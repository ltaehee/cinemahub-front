import { useState } from "react";
import Button from "../Button";
import profileImg from "/images/profileImg.png";

interface FollowUser {
  nickname: string;
  email: string;
  profileImg?: string;
}

interface FollowSectionProps {
  followerCount: number;
  followingCount: number;
  followerList: FollowUser[];
  followingList: FollowUser[];
}

const FollowSection = ({
  followerCount,
  followingCount,
  followerList,
  followingList,
}: FollowSectionProps) => {
  const [view, setView] = useState<"follower" | "following" | null>(null);

  return (
    <div className="w-full flex flex-col gap-2">
      {view === null ? (
        // 📌 기본 상태: 팔로워 & 팔로잉 정보만 표시
        <div className="flex gap-2">
          <div
            className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4 px-12 w-1/2 cursor-pointer"
            onClick={() => setView("follower")}
          >
            <p>팔로워</p>
            <p>{followerCount}명</p>
            <Button className="bg-gray-500 hover:bg-gray-600">
              팔로워 보기
            </Button>
          </div>

          <div
            className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4 px-12 w-1/2 cursor-pointer"
            onClick={() => setView("following")}
          >
            <p>팔로잉</p>
            <p>{followingCount}명</p>
            <Button className="bg-gray-500 hover:bg-gray-600">
              팔로잉 보기
            </Button>
          </div>
        </div>
      ) : (
        // 📌 팔로워/팔로잉 리스트 표시 상태
        <div className="border border-[#DFDFDF] rounded-2xl p-4 w-full">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold">
              {view === "follower" ? "팔로워" : "팔로잉"}
            </h2>
            <button
              className="text-gray-600 hover:text-black font-bold"
              onClick={() => setView(null)}
            >
              ✖
            </button>
          </div>

          <div className="mt-2 bg-gray-100 p-2 rounded-md">
            <input
              type="text"
              placeholder="검색"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <ul className="mt-4 max-h-80 overflow-y-auto space-y-2">
            {(view === "follower" ? followerList : followingList).map(
              (user, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <div className="flex items-center gap-3">
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
                  <Button className="bg-red-500 hover:bg-red-600 px-4 py-1">
                    팔로우
                  </Button>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FollowSection;
