import { useEffect, useRef, useState } from 'react';
import Button from '../Button';
import profileImg from '/images/profileImg.png';
import closeImg from '/images/close.png';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginStore from '../../store/useStore';
import { UserProfile } from '../../store/useProfileStore';
import { getFollowersAPI, getFollowingAPI } from '../../apis/profile';
import useInfinite from '../../hooks/useInfinite';
import SearchBar from '../adminpage/SearchBar';

interface FollowUser {
  nickname: string;
  email: string;
  profile?: string;
  isFollowing?: boolean;
  deletedAt?: string | null;
}

interface FollowSectionProps {
  profile: UserProfile;
  loggedInUserProfile?: UserProfile | null; // 현재 로그인한 유저 정보
  handleFollow: (nickname: string) => void;
  handleUnfollow: (nickname: string) => void;
  debouncingMap: { [key: string]: boolean };
  setLoggedInUserProfile: React.Dispatch<
    React.SetStateAction<UserProfile | null>
  >;
}

const limit = 4;

const FollowSection = ({
  profile,
  handleFollow,
  handleUnfollow,
  loggedInUserProfile,
  setLoggedInUserProfile,
  debouncingMap,
}: FollowSectionProps) => {
  const { nickname } = useParams();

  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followings, setFollowings] = useState<FollowUser[]>([]);
  const [totalFollowing, setTotalFollowing] = useState<number>(0);
  const [totalFollower, setTotalFollower] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [hasMoreFollowings, setHasMoreFollowings] = useState(true);
  const [view, setView] = useState<'follower' | 'following' | null>(null);
  const navigate = useNavigate();
  const { IsLogin } = useLoginStore();
  const [searchTerm, setSearchTerm] = useState('');
  // const [filteredUsers, setFilteredUsers] = useState<FollowUser[]>([]);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* 팔로우,팔로잉 유저 검색 */
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };
  /* 필터링된 유저 리스트 */
  const filteredUsers = (view === 'follower' ? followers : followings).filter(
    (user) => user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* 팔로워 조회 */
  const loadMoreFollowers = async () => {
    if (!hasMoreFollowers || infiniteLoading) return;

    setInfiniteLoading(true);

    const response = await getFollowersAPI(profile.nickname, page, limit);

    if (response.data.length > 0) {
      // 데이터가 존재할 때만 업데이트
      setFollowers((prev) => {
        const uniqueUsers = response.data.filter(
          (newUser: FollowUser) =>
            !prev.some(
              (existingUser) => existingUser.nickname === newUser.nickname
            )
        );
        return [...prev, ...uniqueUsers];
      });

      setTotalFollower(response.total);

      if (response.currentPage < response.totalPages) {
        setPage((prev) => prev + 1);
      } else {
        setHasMoreFollowers(false);
      }
    } else {
      setHasMoreFollowers(false);
    }

    setInfiniteLoading(false);
  };

  /* 팔로잉 조회 */
  const loadMoreFollowing = async () => {
    if (!hasMoreFollowings || infiniteLoading) return;

    setInfiniteLoading(true);

    const response = await getFollowingAPI(profile.nickname, page, limit);
    console.log('Tete', response);

    if (response.data.length > 0) {
      // 데이터가 존재할 때만 업데이트
      setFollowings((prev) => {
        const uniqueUsers = response.data.filter(
          (newUser: FollowUser) =>
            !prev.some(
              (existingUser) => existingUser.nickname === newUser.nickname
            )
        );
        return [...prev, ...uniqueUsers];
      });

      setTotalFollowing(response.total);

      if (response.currentPage < response.totalPages) {
        setPage((prev) => prev + 1);
      } else {
        setHasMoreFollowings(false);
      }
    } else {
      setHasMoreFollowings(false);
    }

    setInfiniteLoading(false);
  };

  const trigger = () => {
    if (view === 'follower' && hasMoreFollowers) {
      loadMoreFollowers();
    } else if (view === 'following' && hasMoreFollowings) {
      loadMoreFollowing();
    }
  };

  const { setTargetRef } = useInfinite(trigger, [
    view === 'follower' ? 1 : view === 'following' ? 2 : 0,
    page,
  ]);

  const handleFollowClick = async (targetNickname: string) => {
    try {
      await handleFollow(targetNickname);

      // 로그인한 유저의 팔로잉 리스트 업데이트
      setLoggedInUserProfile((prev) =>
        prev
          ? {
              ...prev,
              following: [
                ...(prev.following || []),
                { nickname: targetNickname },
              ],
            }
          : prev
      );
    } catch (error) {
      console.error('팔로우 실패:', error);
      alert('팔로우 요청에 실패했습니다.');
    }
  };

  const handleUnfollowClick = async (targetNickname: string) => {
    try {
      await handleUnfollow(targetNickname);

      setLoggedInUserProfile((prev) =>
        prev
          ? {
              ...prev,
              following: prev.following.filter(
                (user) => user.nickname !== targetNickname
              ),
            }
          : prev
      );
    } catch (error) {
      console.error('언팔로우 실패:', error);
      alert('언팔로우 요청에 실패했습니다.');
    }
  };

  /* 버튼 disabled 상태 */
  const isLoading = (nickname: string) => {
    return debouncingMap[nickname] || false;
  };
  useEffect(() => {
    if (!nickname) return;

    const fetchFollowData = async () => {
      setFollowers([]);
      setFollowings([]);
      setPage(1);
      setHasMoreFollowers(true);
      setHasMoreFollowings(true);
      setTotalFollower(0);
      setTotalFollowing(0);

      const followersRes = await getFollowersAPI(nickname, 1, limit);
      setFollowers(followersRes.data);
      setTotalFollower(followersRes.total);

      const followingRes = await getFollowingAPI(nickname, 1, limit);
      setFollowings(followingRes.data);
      setTotalFollowing(followingRes.total);
    };

    fetchFollowData();
  }, [nickname]);

  useEffect(() => {
    loadMoreFollowers();
    loadMoreFollowing();
    // setSearchTerm('');
  }, [view]);

  useEffect(() => {
    if (observerRef.current) {
      setTargetRef(observerRef);
    }
  }, [observerRef.current]);

  return (
    <div className="w-full">
      {view === null ? (
        <div className="w-full h-full flex flex-col gap-2">
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl py-4 px-12">
            <p className="font-semibold">팔로워</p>
            <p className="font-bold text-2xl py-4">{totalFollower}명</p>
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => setView('follower')}
            >
              팔로워 보기
            </Button>
          </div>
          <div className="h-full flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl py-4 px-12">
            <p className="font-semibold">팔로잉</p>
            <p className="font-bold text-2xl py-4">{totalFollowing}명</p>
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => {
                setView('following');
              }}
            >
              팔로잉 보기
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-[#DFDFDF] rounded-2xl p-4 w-full h-full overflow-y-scroll ">
          <div
            className="flex justify-between items-center pb-2"
            ref={observerRef}
          >
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
            {(view === 'follower' ? followers : followings).map(
              (user, index, array) => {
                const isFollowing =
                  loggedInUserProfile?.following?.some(
                    (u) => u.nickname === user.nickname
                  ) ?? false;

                return (
                  <div
                    key={user.nickname}
                    className="flex items-center justify-between p-2"
                    ref={index === array.length - 1 ? observerRef : null}
                  >
                    <div
                      className="w-full flex items-center gap-3 cursor-pointer"
                      onClick={() => {
                        setView(null);
                        setPage(1);

                        navigate(`/profile/${user.nickname}`);
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
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowSection;
