import { useEffect, useMemo, useState } from 'react';
import Button from '../Button';
import profileImg from '/images/profileImg.png';
import closeImg from '/images/close.png';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../store/useStore';
import SearchBar from '../adminpage/SearchBar';
import { UserProfile } from '../../store/useProfileStore';
import { getFollowersAPI, getFollowingAPI } from '../../apis/profile';

interface FollowUser {
  nickname: string;
  email: string;
  profile?: string;
  isFollowing?: boolean;
  deletedAt?: string | null;
}

interface FollowSectionProps {
  profile: UserProfile;
  loggedInUserProfile?: UserProfile | null; // 현재 로그인한 유저 정보 추가
  handleFollow: (nickname: string) => void;
  handleUnfollow: (nickname: string) => void;
  debouncingMap: { [key: string]: boolean };
}

const limit = 4;

const FollowSection = ({
  profile,
  handleFollow,
  handleUnfollow,
  loggedInUserProfile,
  debouncingMap,
}: FollowSectionProps) => {
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [page, setPage] = useState(1);
  const [_hasMore, setHasMore] = useState(true);

  const loadMoreFollowers = async () => {
    const response = await getFollowersAPI(profile.nickname, page, limit);
    setFollowers((prev) => [...prev, ...response.data]);
    setHasMore(response.currentPage < response.totalPages);
    setPage((prev) => prev + 1);
    console.log('FollowersData', response);
  };

  const loadMoreFollowing = async () => {
    const response = await getFollowingAPI(profile.nickname, page, limit);
    setFollowing((prev) => [...prev, ...response.data]);
    setHasMore(response.currentPage < response.totalPages);
    setPage((prev) => prev + 1);
    console.log('FollowingData', response);
  };
  useEffect(() => {
    loadMoreFollowers();
    loadMoreFollowing();
  }, []);

  const filteredFollowers = useMemo(
    () =>
      followers ? followers.filter((user) => user.deletedAt === null) : [],
    [followers]
  );

  const filteredFollowing = useMemo(
    () =>
      following ? following.filter((user) => user.deletedAt === null) : [],
    [following]
  );

  const [view, setView] = useState<'follower' | 'following' | null>(null);
  const navigate = useNavigate();
  const { IsLogin } = useLoginStore();
  /* const [loggedUserProfile, setLoggedUserProfile] =
    useState<UserProfile | null>(loggedInUserProfile || null); */
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<FollowUser[]>([]);

  /* 팔로우,팔로잉 유저 검색 */
  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    if (view === 'follower') {
      setFilteredUsers(
        filteredFollowers.filter((user) =>
          user.nickname.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else if (view === 'following') {
      setFilteredUsers(
        filteredFollowing.filter((user) =>
          user.nickname.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  // 현재 로그인한 유저가 팔로잉하고 있는 닉네임 리스트 추출
  const followingNicknames = following.map((user) => user.nickname) || [];

  const isLoading = (nickname: string) => {
    return debouncingMap[nickname] || false;
  };

  // 팔로우 상태 업데이트 함수
  const updateFollowingState = (nickname: string, isFollowing: boolean) => {
    if (isFollowing) {
      setFollowing((prev) => [...prev, { nickname, email: '', profile: '' }]);
    } else {
      setFollowing((prev) => prev.filter((user) => user.nickname !== nickname));
    }
  };

  // 팔로우 클릭 시 실행되는 함수
  const handleFollowClick = async (nickname: string) => {
    await handleFollow(nickname);
    updateFollowingState(nickname, true);
  };

  // 언팔로우 클릭 시 실행되는 함수
  const handleUnfollowClick = async (nickname: string) => {
    await handleUnfollow(nickname);
    updateFollowingState(nickname, false);
  };

  useEffect(() => {
    setSearchTerm('');
    setFilteredUsers([]);
  }, [view]);

  return (
    <div className="w-full">
      {view === null ? (
        <div className="w-full h-full flex flex-col gap-2">
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl py-4 px-12">
            <p className="font-semibold">팔로워</p>
            <p className="font-bold text-2xl py-4">
              {filteredFollowers.length}명
            </p>
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => setView('follower')}
            >
              팔로워 보기
            </Button>
          </div>
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl py-4 px-12">
            <p className="font-semibold">팔로잉</p>
            <p className="font-bold text-2xl py-4">
              {filteredFollowing.length}명
            </p>
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => setView('following')}
            >
              팔로잉 보기
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-[#DFDFDF] rounded-2xl p-4 w-full h-full overflow-y-scroll ">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-xl font-bold">
              {view === 'follower' ? '팔로워' : '팔로잉'}
            </h2>
            <button
              className="font-bold cursor-pointer"
              onClick={() => setView(null)}
            >
              <img className="w-8" src={closeImg} alt="닫기 버튼" />
            </button>
          </div>

          <div className="w-full">
            <SearchBar
              onSearch={handleSearch}
              useDebounce={false}
              className="w-[full]"
            />
            {(searchTerm
              ? filteredUsers
              : view === 'follower'
              ? filteredFollowers
              : filteredFollowing
            ).map((user) => {
              // 현재 user.nickname이 로그인한 유저의 팔로잉 리스트에 포함되어 있는지 확인
              const isFollowing = followingNicknames.includes(user.nickname);

              return (
                <div
                  key={user.nickname}
                  className="flex items-center justify-between p-2 "
                >
                  <div
                    className="w-full flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${user.nickname}`);
                      setView(null);
                    }}
                  >
                    <img
                      src={user.profile || profileImg}
                      alt="프로필"
                      className="w-10 h-10 object-cover rounded-full"
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
                        alert('로그인이 필요합니다.');
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
                        disabled={isLoading(user.nickname)}
                        className={`${
                          isFollowing ? 'bg-gray-500 hover:bg-gray-400' : ''
                        }`}
                      >
                        {isLoading(user.nickname) ? (
                          <div className="flex justify-center items-center">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                          </div>
                        ) : isFollowing ? (
                          '언팔로우'
                        ) : (
                          '팔로우'
                        )}
                      </Button>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowSection;
