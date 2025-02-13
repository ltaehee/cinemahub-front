import { ChangeEvent, useEffect, useState } from 'react';
import {
  getFetchGoogleData,
  getFetchNaverData,
  getFetchUserData,
} from '../apis/login';
import { useNavigate, useSearchParams } from 'react-router';
import useLoginStore from '../store/useStore';

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

  const handleRegisterUser = async () => {
    console.log(agree, userInfo);
    if (Object.values(userInfo).includes('')) {
      return;
    }

    if (!agree) {
      return;
    }

    try {
      const { result, data, message } = await getFetchUserData(userInfo);
      console.log(result);

      if (!result) {
        throw new Error(message);
      }
      login();
      console.log(data);
      navigator('/', { replace: true });
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
    <div>
      <div>
        <h1>기본 회원 정보를 입력해주세요.</h1>
      </div>

      <div>
        <label htmlFor="nickname">프로필 이름</label>
        <br />
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={userInfo.nickname}
          onChange={handleChangeNickname}
        />

        <p>이메일</p>
        <p>{userInfo.email}</p>
      </div>

      <div>
        <input type="checkbox" checked={agree} onChange={handleAgree} />
        <span>이용약관과 개인정보처리방침에 동의합니다.</span>
      </div>

      <div>
        <button onClick={() => navigator('/login', { replace: true })}>
          취소
        </button>
        <button onClick={handleRegisterUser}>등록</button>
      </div>
    </div>
  );
};

export default Register;
