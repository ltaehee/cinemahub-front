import Tabs from '@ui/Tabs';
import MovieCard from '../mainpage/MovieCard';
import { FC, useEffect, useState } from 'react';
import PersonCard from '../mainpage/PersonCard';
import CinemaDetailPage from '../../pages/CinemaDetailPage';
import PersonDetailPage from '../../pages/PersonDetailPage';
import Pagination from '@ui/Pagination';
import { useModalOpenStore } from '../../store/useModalOpenStore';
import ModalPage from '@ui/ModalPage';
import { UserProfile } from '../../store/useProfileStore';
import {
  getFavoriteMoviesAPI,
  getFavoritePersonsAPI,
} from '../../apis/favorite';
import { getUserReviewsAPI } from '../../apis/profile';

interface TabContainerProps {
  profile: UserProfile;
}

const limit = 4; // 한 페이지에 보여줄 데이터 수
const blockSize = 10; // 버튼 최대갯수?
const reviewLimit = 5;

const TabContainer: FC<TabContainerProps> = ({ profile }) => {
  const {
    isMovieOpen,
    isPersonOpen,
    setIsMovieOpen,
    setIsPersonOpen,
    selectedMovie,
    setSelectedMovie,
    selectedPerson,
    setSelectedPerson,
  } = useModalOpenStore();

  /* 즐겨찾기 영화 */
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [totalFavoriteMovies, setTotalFavoriteMovies] = useState(0); // 총 데이터 수
  const [page, setPage] = useState(0);

  /* 즐겨찾기 영화인 */
  const [favoritePersons, setFavoritePersons] = useState<any[]>([]);
  const [totalFavoritePersons, setTotalFavoritePersons] = useState(0); // 총 데이터 수
  const [pagePersons, setPagePersons] = useState(0);

  /* 평점 내역 */
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [pageReviews, setPageReviews] = useState(0);

  /* 탭메뉴 */
  const [activeTab, setActiveTab] = useState(1);
  const handleChangeTab = (index: number) => {
    setActiveTab(index);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };
  const handleChangePagePersons = (page: number) => {
    setPagePersons(page);
  };
  const handleChangePageReviews = (page: number) => {
    setPageReviews(page);
  };

  /* 즐겨찾기 영화 데이터 조회 */
  const fetchFavoriteMovies = async (nickname: string, page = 0) => {
    try {
      const response = await getFavoriteMoviesAPI(nickname, page + 1, limit);
      setFavoriteMovies(response.data);
      setTotalFavoriteMovies(response.total);
    } catch (error) {}
  };

  /* 즐겨찾기 영화인 데이터 조회 */
  const fetchFavoritePersons = async (nickname: string, page = 0) => {
    try {
      const response = await getFavoritePersonsAPI(nickname, page + 1, limit);
      setFavoritePersons(response.data);
      setTotalFavoritePersons(response.total);
    } catch (error) {}
  };

  // 리뷰 조회
  const fetchReviews = async (nickname: string, page = 0) => {
    try {
      const response = await getUserReviewsAPI(nickname, page + 1, limit);
      setReviews(response.data);
      setTotalReviews(response.total);
    } catch (error) {
      console.error('리뷰 데이터를 가져오는 데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    if (profile.nickname) {
      fetchReviews(profile.nickname);
    }
  }, [profile.nickname]);

  useEffect(() => {
    if (profile.nickname) {
      fetchFavoriteMovies(profile.nickname, page);
    }
  }, [profile.nickname, page]);

  useEffect(() => {
    if (profile.nickname) {
      fetchFavoritePersons(profile.nickname, pagePersons);
    }
  }, [profile.nickname, pagePersons]);

  useEffect(() => {
    if (profile.nickname) {
      fetchReviews(profile.nickname, pageReviews);
    }
  }, [profile.nickname, pageReviews]);

  return (
    <div className="w-full max-w-[1280px] flex px-8 box-border">
      <Tabs onChangeTab={handleChangeTab} className="w-full">
        <Tabs.MenuList className="flex w-full mb-12">
          <Tabs.Menu
            index={1}
            className={`w-full flex-1 py-2 text-center border-b-2 transition cursor-pointer ${
              activeTab === 1
                ? 'border-[#FF0000] text-[#FF0000] font-bold'
                : 'border-gray-300'
            }`}
          >
            좋아하는 영화
          </Tabs.Menu>
          <Tabs.Menu
            index={2}
            className={`w-full flex-1 py-2 text-center border-b-2 transition cursor-pointer ${
              activeTab === 2
                ? 'border-[#FF0000] text-[#FF0000] font-bold'
                : 'border-gray-300'
            }`}
          >
            좋아하는 영화인
          </Tabs.Menu>
          <Tabs.Menu
            index={3}
            className={`w-full flex-1 py-2 text-center border-b-2 transition cursor-pointer ${
              activeTab === 3
                ? 'border-[#FF0000] text-[#FF0000] font-bold'
                : 'border-gray-300'
            }`}
          >
            평점 내역
          </Tabs.Menu>
        </Tabs.MenuList>
        <Tabs.Pannel index={1} className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-15">
            {favoriteMovies.length ? (
              favoriteMovies.map((movie) => (
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
          <Pagination
            total={totalFavoriteMovies}
            value={page}
            onPageChange={handleChangePage}
            pageSize={limit}
            blockSize={blockSize}
            className="mb-10"
          >
            <Pagination.Navigator className="flex gap-4">
              <Pagination.Buttons className="flex gap-4" />
            </Pagination.Navigator>
          </Pagination>
        </Tabs.Pannel>
        <Tabs.Pannel index={2} className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-26">
            {favoritePersons.length ? (
              favoritePersons.map((person) => (
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
          <Pagination
            total={totalFavoritePersons}
            value={pagePersons}
            onPageChange={handleChangePagePersons}
            pageSize={limit}
            blockSize={blockSize}
            className="mb-10"
          >
            <Pagination.Navigator className="flex gap-4">
              <Pagination.Buttons className="flex gap-4" />
            </Pagination.Navigator>
          </Pagination>
        </Tabs.Pannel>
        <Tabs.Pannel index={3} className="flex flex-col items-center gap-6">
          <div className="border-2 border-black">
            <h2>리뷰 내역:</h2>
            {reviews.length ? (
              reviews.map((review) => (
                <div key={`review-${review._id}`}>
                  <p>{review.content}</p>
                  <p>별점: {review.starpoint}</p>
                </div>
              ))
            ) : (
              <p>리뷰가 없습니다.</p>
            )}
          </div>
          <Pagination
            total={totalReviews}
            value={pageReviews}
            onPageChange={handleChangePageReviews}
            pageSize={reviewLimit}
            blockSize={blockSize}
            className="mb-10"
          >
            <Pagination.Navigator className="flex gap-4">
              <Pagination.Buttons className="flex gap-4" />
            </Pagination.Navigator>
          </Pagination>
        </Tabs.Pannel>
      </Tabs>

      {/* 상세 페이지 모달 시작 */}
      <ModalPage
        pageParams="movie"
        setPageOpen={setIsMovieOpen}
        setSelectedPage={setSelectedMovie}
        selectedPage={selectedMovie}
        isPageOpen={isMovieOpen}
        pageFrom={window.location.pathname}
      >
        {selectedMovie !== null && <CinemaDetailPage movieId={selectedMovie} />}
      </ModalPage>

      <ModalPage
        pageParams="person"
        setPageOpen={setIsPersonOpen}
        setSelectedPage={setSelectedPerson}
        selectedPage={selectedPerson}
        isPageOpen={isPersonOpen}
        pageFrom={window.location.pathname}
      >
        {selectedPerson !== null && (
          <PersonDetailPage personId={selectedPerson} />
        )}
      </ModalPage>
      {/* 상세 페이지 모달 끝 */}
    </div>
  );
};

export default TabContainer;
