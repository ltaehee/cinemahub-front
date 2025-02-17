import Button from "../components/Button";
import TabContainer from "../components/mypage/TabContainer";
import profileImg from "/images/profileImg.png";
import profileEdit from "/images/profileEdit.png";
import profileEdit2 from "/images/profileEdit2.png";
import { useState } from "react";

const MyPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("이태희");
  const [intro, setIntro] = useState("한줄소개");

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-[1280px] flex gap-2 mt-10 mb-20">
          <div className="w-full border border-[#DFDFDF] rounded-2xl">
            <div className="w-full relative w-full flex flex-col gap-2 items-center p-2">
              <div className="w-full flex justify-end mb-4">
                <img
                  src={isEditing ? profileEdit2 : profileEdit}
                  alt="프로필 수정 버튼"
                  className="w-8 cursor-pointer"
                  onClick={handleEditClick}
                />
              </div>
              <img src={profileImg} alt="프로필 사진" className="w-30" />
              {isEditing ? (
                <div className="w-[90%]">
                  <p>이름</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-400 w-full p-1 rounded"
                  />
                </div>
              ) : (
                <p>{name}</p>
              )}
              {!isEditing && <p className="text-gray-500">test@naver.com</p>}
              {isEditing ? (
                <div className="w-[90%]">
                  <p>자기소개</p>
                  <textarea
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    className="border border-gray-400 w-full p-1 rounded resize-none"
                  />
                </div>
              ) : (
                <p className="text-gray-500">{intro}</p>
              )}
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
              <p className="">팔로워</p>
              <p>110명</p>
              <Button className="!w-[80%] bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400">
                팔로워 보기
              </Button>
            </div>
          </div>
        </div>
        <TabContainer />
      </div>
    </>
  );
};

export default MyPage;
