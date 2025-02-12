import { Outlet } from "react-router-dom";
import LogoImg from "../assets/LogoImg";

const MainPage = () => {
  return (
    <>
      <Outlet />
      <div className="font-extrabold text-6xl">메인페이지</div>
      <LogoImg className="w-32" />
    </>
  );
};

export default MainPage;
