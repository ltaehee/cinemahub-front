import Tabs from "@ui/Tabs";
import MovieCard from "../mainpage/MovieCard";
import { FC, useEffect, useState } from "react";
import PersonCard from "../mainpage/PersonCard";
import { UserProfile } from "../../pages/ProfilePage";
import { baseInstance } from "../../apis/axios.config";
import { useNavigate, useSearchParams } from "react-router-dom";
import Modal from "@ui/Modal";
import XIcon from "../../icons/XIcon";
import CinemaDetailPage from "../../pages/CinemaDetailPage";
import PersonDetailPage from "../../pages/PersonDetailPage";

interface TabContainerProps {
  profile: UserProfile;
}

const TabContainer: FC<TabContainerProps> = ({ profile }) => {
  /* 상세 페이지 모달 시작 */
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movie");
  const personId = searchParams.get("person");
  const [isMovieOpen, setIsMovieOpen] = useState<boolean>(false);
  const [isPersonOpen, setIsPersonOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);

  const closeModal = () => {
    setSelectedMovie(null);
    setSelectedPerson(null);
    setIsMovieOpen(false);
    setIsPersonOpen(false);
    navigate(
      {
        pathname: window.location.pathname, // 현재 경로 유지
        search: "",
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (movieId) setSelectedMovie(Number(movieId));
    if (personId) setSelectedPerson(Number(personId));
  }, [movieId, personId]);

  useEffect(() => {
    if (selectedMovie) {
      setIsMovieOpen(true);
    } else {
      setIsMovieOpen(false);
    }
  }, [selectedMovie]);

  useEffect(() => {
    if (selectedPerson) {
      setIsPersonOpen(true);
    } else {
      setIsPersonOpen(false);
    }
  }, [selectedPerson]);
  /* 상세 페이지 모달 끝 */

  const [activeTab, setActiveTab] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]); // 리뷰 데이터를 저장할 상태

  const handleChangeTab = (index: number) => {
    setActiveTab(index);
  };

  // 리뷰 조회
  const fetchReviews = async (nickname: string) => {
    try {
      const response = await baseInstance.get(
        `/review/user-reviews/${nickname}`
      );
      console.log(response.data);
      setReviews(response.data.data);
    } catch (error) {
      console.error("리뷰 데이터를 가져오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    if (profile.nickname) {
      fetchReviews(profile.nickname);
    }
  }, [profile.nickname]);

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
        <Tabs.Pannel index={3}>
          {/* 평점 내역 콘솔 출력 */}
          <div>
            <h2>리뷰 내역:</h2>
            {reviews.length ? (
              reviews.map((review, index) => (
                <div key={index}>
                  <p>{review.content}</p>
                  <p>별점: {review.starpoint}</p>
                </div>
              ))
            ) : (
              <p>리뷰가 없습니다.</p>
            )}
          </div>
        </Tabs.Pannel>
      </Tabs>

      {/* 상세 페이지 모달 시작 */}
      <Modal onCloseModal={closeModal} open={isMovieOpen}>
        <Modal.Backdrop className="z-1 bg-black/50 backdrop-blur-lg" />
        <Modal.Content className="z-2 my-[128px] top-0">
          <Modal.Close>
            <XIcon fill="#fff" className="fixed top-4 right-4 w-6 z-1" />
          </Modal.Close>
          {selectedMovie !== null && (
            <CinemaDetailPage movieId={selectedMovie} />
          )}
        </Modal.Content>
      </Modal>

      <Modal onCloseModal={closeModal} open={isPersonOpen}>
        <Modal.Backdrop className="z-1 bg-black/50 backdrop-blur-lg" />
        <Modal.Content className="z-2 my-[128px] top-0">
          <Modal.Close>
            <XIcon fill="#000" className="fixed top-4 right-4 w-6" />
          </Modal.Close>
          {selectedPerson !== null && (
            <PersonDetailPage personId={selectedPerson} />
          )}
        </Modal.Content>
      </Modal>
      {/* 상세 페이지 모달 끝 */}
    </div>
  );
};

export default TabContainer;
