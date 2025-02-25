import Tabs from "@ui/Tabs";
import MovieCard from "../mainpage/MovieCard";
import { FC, useState } from "react";
import PersonCard from "../mainpage/PersonCard";
import { UserProfile } from "../../pages/ProfilePage";

interface TabContainerProps {
  profile: UserProfile;
}

const TabContainer: FC<TabContainerProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState(1);
  const handleChangeTab = (index: number) => {
    setActiveTab(index);
  };
  console.log("profile 찐찐", { profile });

  return (
    <div className="w-full max-w-[1280px] flex px-8">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.favoriteMovies?.length ? (
              profile.favoriteMovies.map((movie) => (
                <MovieCard
                  key={movie.movieId}
                  movieId={movie.movieId}
                  title={movie.title}
                  releaseDate={movie.releaseDate}
                  posterPath={movie.posterPath}
                  genreIds={movie.genreIds}
                />
              ))
            ) : (
              <p>즐겨찾기한 영화가 없습니다.</p>
            )}
          </div>
        </Tabs.Pannel>
        <Tabs.Pannel index={2}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4  ">
            {profile.favoritePersons?.length ? (
              profile.favoritePersons.map((person) => (
                <PersonCard
                  key={person.personId}
                  personId={person.personId}
                  name={person.name}
                  profilePath={person.profilePath}
                />
              ))
            ) : (
              <p>즐겨찾기한 인물이 없습니다.</p>
            )}
          </div>
        </Tabs.Pannel>
        <Tabs.Pannel index={3}>평점 내역 컴포넌트</Tabs.Pannel>
      </Tabs>
    </div>
  );
};

export default TabContainer;
