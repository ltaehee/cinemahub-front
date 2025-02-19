import { ChangeEvent, useEffect, useState } from 'react';
import {
  getFetchGoogleData,
  getFetchNaverData,
  getFetchNicknameCheck,
  getFetchUserData,
} from '../apis/login';
import { useNavigate, useSearchParams } from 'react-router';
import useLoginStore from '../store/useStore';
import bgMovies from '../images/bg-image.jpg';

type UserInfoType = {
  email: string;
  nickname: string;
  profile: string;
};

const defaultUserInfo = {
  email: '',
  nickname: '',
  profile: '',
};

const Register = () => {
  const navigator = useNavigate();
  const login = useLoginStore((state) => state.login);

  const [searchparam, _] = useSearchParams();
  const social = searchparam.get('social') || null;

  const [userInfo, setUserInfo] = useState<UserInfoType>(defaultUserInfo);
  const [agree, setAgree] = useState<boolean>(false);

  const handleGetGoogleDataFetch = async () => {
    try {
      const { result, data, message } = await getFetchGoogleData();
      if (!result) throw new Error(message);

      const { email, name, picture } = data;
      setUserInfo((prev) => ({
        ...prev,
        email,
        nickname: name,
        profile: picture,
      }));
    } catch (e) {}
  };

  const handleGetNaverDataFetch = async () => {
    try {
      const { result, data, message } = await getFetchNaverData();
      if (!result) throw new Error(message);

      const { email, nickname, profile_image } = data;
      setUserInfo((prev) => ({
        ...prev,
        email,
        nickname,
        profile: profile_image,
      }));
    } catch (e) {}
  };

  const handleChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgree = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setAgree(checked);
  };

  const handleUniqueNickName = async (name: string) => {
    if (!name) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const { result, nickname, message } = await getFetchNicknameCheck(name);
      if (!result) throw new Error(message);

      setUserInfo((prev) => ({ ...prev, nickname }));
      alert(message);
    } catch (e) {}
  };

  const handleRegisterUser = async () => {
    if (Object.values(userInfo).includes('')) {
      alert('소셜 계정 정보를 불러올 수 없습니다. 다시 로그인을 진행해주세요.');
      return;
    }

    if (!agree) {
      alert('이용약관 및 개인정보이용방침에 동의해주세요.');
      return;
    }

    try {
      const { result, message } = await getFetchUserData(userInfo);
      console.log(result, message);

      if (!result) {
        throw new Error(message);
      }
      login();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (social === '1') handleGetGoogleDataFetch();
    if (social === '2') handleGetNaverDataFetch();
    if (social === null) {
      navigator('/login', { replace: true });
    }
  }, []);

  return (
    <div className="relative grid place-items-center w-full h-screen">
      <div className="absolute z-0 inset-0 overflow-hidden">
        <img
          className="min-w-full min-h-full max-w-none"
          src={bgMovies}
          alt="배경 이미지"
        />
      </div>

      <div className="relative z-1 max-w-md px-2 mx-auto">
        <div className="flex flex-col items-center justify-center p-10 rounded-2xl bg-slate-200 gap-5">
          <h1 className="font-bold text-2xl">회원 정보 입력</h1>

          <div>
            <label htmlFor="nickname">닉네임</label>

            <div className="relative w-[360px] bg-white p-3 border border-slate-300 rounded-[10px]">
              <input
                className="w-60 focus:outline-none active:bg-white"
                type="text"
                id="nickname"
                name="nickname"
                placeholder="닉네임을 입력해주세요."
                value={userInfo.nickname}
                onChange={handleChangeNickname}
              />
              <button
                onClick={() => handleUniqueNickName(userInfo.nickname)}
                className="absolute cursor-pointer top-2 right-4 p-1 text-white text-sm bg-blue-300 border border-slate-300 rounded-[10px]"
              >
                중복확인
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <input
              id="agree"
              type="checkbox"
              className="w-[24px] h-[24px] border border-slate-300 rounded-[10px] focus:ring-blue-500"
              checked={agree}
              onChange={handleAgree}
            />

            <label
              htmlFor="agree"
              className="text-md font-medium text-gray-900"
            >
              <span
                className="text-blue-500"
                onClick={() => window.open('/policy', '_blank')}
              >
                이용약관
              </span>{' '}
              과{' '}
              <span
                className="text-blue-500"
                onClick={() => window.open('/policy', '_blank')}
              >
                개인정보처리방침
              </span>
              에 동의합니다.
            </label>
          </div>

          <button
            className="w-full p-3 bg-white border border-slate-300 rounded-[10px]"
            onClick={() => navigator('/login', { replace: true })}
          >
            취소
          </button>
          <button
            className="w-full p-3 bg-red-400 border border-slate-300 rounded-[10px]"
            onClick={handleRegisterUser}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
