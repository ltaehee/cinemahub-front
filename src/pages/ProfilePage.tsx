import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import profileImg from '/images/profileImg.png';
import profileCamera from '/images/camera.png';
import profileEdit from '/images/profileEdit.png';
import profileEdit2 from '/images/profileEdit2.png';
import { useEffect, useRef, useState } from 'react';
import FollowSection from '../components/profilepage/FollowSection';
import TabContainer from '../components/profilepage/TabContainer';
import useLoginStore from '../store/useStore';
import {
  followUser,
  getFetchNicknameCheck,
  getLoggedInUserInfo,
  getPresignedUrl,
  getProfileData,
  unfollowUser,
  updateProfileData,
  uploadImageToS3,
} from '../apis/profile';
import { profileSchema } from '../schemas/ProfileSchema';

export interface UserProfile {
  userId: string;
  email: string;
  nickname: string;
  introduce: string;
  profile?: string;
  followers: {
    nickname: string;
    email: string;
    profile?: string;
    deletedAt?: string | null;
  }[];
  following: {
    nickname: string;
    email: string;
    profile?: string;
    deletedAt?: string | null;
  }[];
  favorites: {
    favoriteType: string;
    favoriteId: string;
  }[];
  favoriteMovies?: {
    movieId: number;
    title: string;
    releaseDate: string;
    posterPath: string;
    genreIds: [];
  }[];

  favoritePersons?: {
    personId: number;
    name: string;
    profilePath: string;
  }[];
}

const ProfilePage = () => {
  const { nickname } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // url 기준 프로필 정보
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // 이미지 상태 추가
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // originalNickname 프로필 수정 전 닉네임
  const [originalNickname, setOriginalNickname] = useState<string>('');
  const [loggedInUserProfile, setLoggedInUserProfile] =
    useState<UserProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { IsLogin } = useLoginStore();
  const [debouncingMap, setDebouncingMap] = useState<{
    [key: string]: boolean;
  }>({});

  // 디바운싱 상태 업데이트 함수
  const updateDebouncingMap = (nickname: string, value: boolean) => {
    setDebouncingMap((prev) => ({
      ...prev,
      [nickname]: value,
    }));
  };

  /* 로그인한 유저 프로필 조회 */
  const fetchLoggedInUserInfo = async () => {
    const userInfo = await getLoggedInUserInfo();
    setLoggedInUserProfile(userInfo);
    setOriginalNickname(userInfo.nickname);
  };

  /* url에 나온 닉네임 기준 프로필 조회 */
  const fetchProfileData = async () => {
    const profileData = await getProfileData(nickname as string);

    setProfile(profileData);
    setIsOwnProfile(profileData.isOwnProfile);
    setIsFollowing(profileData.isFollowing);
  };

  /* 이미지 미리보기 */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /* 이미지 업로드 */
  const handleImageUpload = async () => {
    if (!selectedImage) return;
    try {
      setIsUploading(true);
      // Presigned URL 요청
      const presignedUrl = await getPresignedUrl(selectedImage.name);

      // S3에 이미지 업로드
      await uploadImageToS3(presignedUrl, selectedImage);
      const imageUrl = presignedUrl.split('?')[0];

      if (!profile) {
        return;
      }
      await updateProfileData(profile.nickname, profile.introduce, imageUrl);
      setProfile({ ...profile, profile: imageUrl });

      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      setPreviewImage(null);
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false); // 이미지 업로드 완료 후 스피너 제거
    }
  };

  /* 닉네임 중복 체크 */
  const checkNicknameCheck = async (
    nickname: string,
    currentNickname: string
  ) => {
    try {
      const { result } = await getFetchNicknameCheck(nickname, currentNickname);
      return result;
    } catch (error) {
      console.error('닉네임 중복 체크 오류:', error);
      return false;
    }
  };
  /* 프로필 수정 */
  const handleEditClick = async () => {
    try {
      if (isEditing && originalNickname) {
        const result = profileSchema.safeParse({
          nickname: profile?.nickname || '',
          introduce: profile?.introduce || '',
        });

        // 유효성 검사 실패 시 에러 메시지 나오게
        if (!result.success) {
          const errorMessages = result.error.errors.map((err) => err.message);
          alert(errorMessages);
          return;
        }

        // 닉네임 중복 체크
        const isUnique = await checkNicknameCheck(
          profile?.nickname || '',
          originalNickname
        );
        if (!isUnique) {
          alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력하세요.');
          return;
        }
        if (!profile) {
          return;
        }

        // 이미지 업로드
        if (selectedImage) {
          await handleImageUpload();
        }

        // 프로필 데이터 업데이트
        await updateProfileData(profile.nickname, profile.introduce);

        alert('프로필 수정 완료');

        // 닉네임이 변경된 경우 URL도 수정
        if (originalNickname && profile.nickname !== originalNickname) {
          navigate(`/profile/${profile.nickname}`);
        }
      }
    } catch (error) {
      alert('프로필 수정 실패');
    } finally {
      setIsEditing(!isEditing);
    }
  };

  /* 팔로우 요청 */
  const handleFollow = async (targetNickname: string) => {
    if (debouncingMap[targetNickname]) return;
    updateDebouncingMap(targetNickname, true);

    try {
      await followUser(targetNickname);
      await fetchProfileData(); // 프로필 데이터 갱신
    } catch (error) {
      console.error('팔로우 요청 오류:', error);
      alert('팔로우 요청 실패');
    } finally {
      setTimeout(() => {
        updateDebouncingMap(targetNickname, false);
      }, 1000);
    }
  };

  /* 언팔로우 요청 */
  const handleUnfollow = async (targetNickname: string) => {
    if (debouncingMap[targetNickname]) return;
    updateDebouncingMap(targetNickname, true);

    try {
      await unfollowUser(targetNickname);
      await fetchProfileData(); // 프로필 데이터 갱신
    } catch (error) {
      console.error('언팔로우 요청 오류:', error);
      alert('언팔로우 요청 실패');
    } finally {
      setTimeout(() => {
        updateDebouncingMap(targetNickname, false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [nickname]);

  useEffect(() => {
    fetchLoggedInUserInfo();
  }, [nickname]);

  if (!profile) {
    return;
  }
  console.log('로그인 기준 프로필', loggedInUserProfile);
  console.log('url기준 프로필', profile);
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='w-full max-w-[1280px] flex gap-2 mt-10 mb-20 px-8 max-h-[440px]'>
        <div className='w-full  border border-[#DFDFDF] rounded-2xl'>
          <div className='w-full relative flex flex-col gap-2 items-center p-2'>
            <div className='w-full flex justify-end mb-4'>
              {isOwnProfile ? (
                <img
                  src={isEditing ? profileEdit2 : profileEdit}
                  alt='프로필 수정 버튼'
                  className='w-8 cursor-pointer'
                  onClick={handleEditClick}
                />
              ) : null}
            </div>
            <div className='relative'>
              <img
                src={previewImage || profile.profile || profileImg}
                alt='프로필 사진'
                className='w-35 h-35 object-cover rounded-full'
              />
              {isEditing && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className='absolute cursor-pointer top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.3)] rounded-full'
                >
                  <img
                    src={profileCamera}
                    alt='프로필 카메라 아이콘'
                    className='w-8'
                  />
                </div>
              )}
              {isUploading && (
                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.3)] rounded-full'>
                  <div className='w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type='file'
              className='hidden'
              onChange={handleImageChange}
            />
            {isEditing ? (
              <div className='w-[90%]'>
                <div className='flex justify-between'>
                  <p className='font-semibold'>닉네임</p>
                  <p className='text-sm text-gray-500 pl-8'>
                    최소 2글자, 최대 10글자까지 가능합니다.
                  </p>
                </div>
                <input
                  type='text'
                  value={profile.nickname}
                  onChange={(e) =>
                    setProfile({ ...profile, nickname: e.target.value })
                  }
                  className='border border-gray-400 w-full p-1 rounded'
                  maxLength={10}
                />
              </div>
            ) : (
              <p>{profile.nickname}</p>
            )}
            {!isEditing && <p className='text-gray-500'>{profile.email}</p>}
            {isEditing ? (
              <div className='w-[90%]'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold'>자기소개</p>
                  <div className='flex'>
                    <p className='text-gray-500 text-sm pl-4'>
                      최대 50글자까지 가능합니다.
                    </p>
                    <p className='pl-2 text-gray-500 text-sm'>
                      {profile.introduce.length} / 50
                    </p>
                  </div>
                </div>
                <textarea
                  value={profile.introduce}
                  onChange={(e) =>
                    setProfile({ ...profile, introduce: e.target.value })
                  }
                  className='border border-gray-400 w-full p-1 pb-10  rounded resize-none relative'
                  maxLength={50}
                />
              </div>
            ) : (
              <p>{profile.introduce || '자기소개를 해주세요'}</p>
            )}

            <div className='w-full px-12'>
              {!IsLogin && (
                <Button
                  onClick={() => {
                    alert('로그인이 필요합니다.');
                  }}
                >
                  팔로우
                </Button>
              )}
              {!isOwnProfile && !isFollowing && IsLogin && (
                <Button onClick={() => handleFollow(profile.nickname)}>
                  {debouncingMap[profile.nickname] ? (
                    <div className='flex justify-center items-center'>
                      <div className='w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
                    </div>
                  ) : (
                    '팔로우'
                  )}
                </Button>
              )}
              {!isOwnProfile && isFollowing && (
                <Button
                  onClick={() => handleUnfollow(profile.nickname)}
                  className='bg-gray-500 hover:bg-gray-400'
                >
                  {debouncingMap[profile.nickname] ? (
                    <div className='flex justify-center items-center'>
                      <div className='w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
                    </div>
                  ) : (
                    '언팔로우'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        <FollowSection
          profile={profile}
          loggedInUserProfile={loggedInUserProfile}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
          debouncingMap={debouncingMap}
        />
      </div>

      <TabContainer profile={profile} />
    </div>
  );
};

export default ProfilePage;
