import Tabs from "@ui/Tabs";
import MovieCard from "../mainpage/MovieCard";
import movie1 from "/images/movie1.png";
import movie2 from "/images/movie2.png";
import { useState } from "react";
import PersonCard from "../mainpage/PersonCard";

const dummyMovies = [
  {
    id: "1",
    name: "중증외상센터",
    image: movie2,
    rating: 8.8,
    genre: "드라마",
    ageLimit: "15+",
  },
  {
    id: "2",
    name: "백두산",
    image: movie1,
    rating: 8.8,
    genre: "SF, 액션",
    ageLimit: "12세 이상",
  },
  {
    id: "3",
    name: "부산행2",
    image: movie1,
    rating: 8.8,
    genre: "SF, 액션",
    ageLimit: "12+",
  },
  {
    id: "4",
    name: "중증외상센터2",
    image: movie2,
    rating: 8.8,
    genre: "SF, 액션",
    ageLimit: "12+",
  },
];

const TabContainer = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleChangeTab = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full max-w-[1280px]">
      <Tabs onChangeTab={handleChangeTab} className="w-[1280px]">
        <Tabs.MenuList className="flex w-full mb-12">
          <Tabs.Menu
            index={1}
            className={`w-full flex-1 py-2 text-center border-b-2 transition cursor-pointer ${
              activeTab === 1
                ? "border-[#FF0000] text-[#FF0000] font-bold"
                : "border-gray-300"
            }`}
          >
            좋아하는 영화
          </Tabs.Menu>
          <Tabs.Menu
            index={2}
            className={`w-full flex-1 py-2 text-center border-b-2 transition cursor-pointer ${
              activeTab === 2
                ? "border-[#FF0000] text-[#FF0000] font-bold"
                : "border-gray-300"
            }`}
          >
            좋아하는 영화인
          </Tabs.Menu>
          <Tabs.Menu
            index={3}
            className={`w-full flex-1 py-2 text-center border-b-2 transition cursor-pointer ${
              activeTab === 3
                ? "border-[#FF0000] text-[#FF0000] font-bold"
                : "border-gray-300"
            }`}
          >
            평점 내역
          </Tabs.Menu>
        </Tabs.MenuList>
        <Tabs.Pannel index={1}>
          <div className="max-w-[1280px] w-full mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-[50px] mb-4"></div>
        </Tabs.Pannel>
        <Tabs.Pannel index={2}>
          {/* <PersonCard /> */}
          인물 컴포넌트
        </Tabs.Pannel>
        <Tabs.Pannel index={3}>평점 내역 컴포넌트</Tabs.Pannel>
      </Tabs>
    </div>
  );
};

export default TabContainer;
