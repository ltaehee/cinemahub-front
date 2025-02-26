import Tabs from '@ui/Tabs';
import MovieCard from '../mainpage/MovieCard';
import { FC, useEffect, useState } from 'react';
import PersonCard from '../mainpage/PersonCard';
import { UserProfile } from '../../pages/ProfilePage';
import { baseInstance } from '../../apis/axios.config';
import CinemaDetailPage from '../../pages/CinemaDetailPage';
import PersonDetailPage from '../../pages/PersonDetailPage';
import Pagination from '@ui/Pagination';
import { useModalOpenStore } from '../../store/useModalOpenStore';
import ModalPage from '@ui/ModalPage';

interface TabContainerProps {
  profile: UserProfile;
}

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

  /* 페이지네이션 */
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [totalMovie, setTotalMovie] = useState(0); // 총 데이터 수
  const [page, setPage] = useState(0);
  const limit = 4;

  const handleChangePage = (page: number) => {
    setPage(page);
  };
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
      console.error('리뷰 데이터를 가져오는 데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    console.log('현재페이지', window.location.pathname);
  }, [window.location.pathname]);
  useEffect(() => {
    if (profile.nickname) {
      fetchReviews(profile.nickname);
    }
  }, [profile.nickname]);

  return (
    <div className='w-full max-w-[1280px] flex px-8 box-border'>
      <Tabs onChangeTab={handleChangeTab} className='w-full'>
        <Tabs.MenuList className='flex w-full mb-12'>
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
        <Tabs.Pannel
          index={1}
          className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-15'
        >
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
          <Pagination
            total={totalMovie}
            value={page}
            onPageChange={handleChangePage}
            blockSize={totalPages}
            pageSize={limit}
            className='flex justify-center p-3 '
          >
            <Pagination.Navigator className='flex gap-4'>
              <Pagination.Buttons className='PaginationButtons flex gap-4 font-bold text-slate-300' />
            </Pagination.Navigator>
          </Pagination>
        </Tabs.Pannel>
        <Tabs.Pannel
          index={2}
          className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-26'
        >
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
      <ModalPage
        pageParams='movie'
        setPageOpen={setIsMovieOpen}
        setSelectedPage={setSelectedMovie}
        selectedPage={selectedMovie}
        isPageOpen={isMovieOpen}
        pageFrom={window.location.pathname}
      >
        {selectedMovie !== null && <CinemaDetailPage movieId={selectedMovie} />}
      </ModalPage>

      <ModalPage
        pageParams='person'
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
