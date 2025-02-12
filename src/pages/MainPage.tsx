import { Outlet } from 'react-router-dom';

const MainPage = () => {
  return (
    <>
      <Outlet />
      <div className="font-extrabold text-6xl">메인페이지</div>
    </>
  );
};

export default MainPage;
