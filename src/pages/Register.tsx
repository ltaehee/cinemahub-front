import { useEffect } from 'react';
import { getFetchGoogleData } from '../apis/login';

const Register = () => {
  const handleGetDataFetch = async () => {
    const data = await getFetchGoogleData();
    console.log(data);
  };

  useEffect(() => {
    handleGetDataFetch();
    // navigator('/', { replace: true });
  });

  return <>등록 화면</>;
};

export default Register;
