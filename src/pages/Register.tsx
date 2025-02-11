import { useEffect } from 'react';
import { getFetchGoogleData, getFetchNaverData } from '../apis/login';
import { useSearchParams } from 'react-router';

const Register = () => {
  const [searchparam, _] = useSearchParams();
  const social = searchparam.get('social');

  const handleGetGoogleDataFetch = async () => {
    const data = await getFetchGoogleData();
    console.log(data);
  };

  const handleGetNaverDataFetch = async () => {
    const data = await getFetchNaverData();
    console.log(data);
  };

  useEffect(() => {
    if (social === '1') handleGetGoogleDataFetch();
    if (social === '2') handleGetNaverDataFetch();
    // navigator('/', { replace: true });
  });

  return <>등록 화면</>;
};

export default Register;
