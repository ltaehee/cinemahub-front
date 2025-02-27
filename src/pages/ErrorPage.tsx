import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import bgImage from "../assets/images/lost-image.avif";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="flex justify-center items-center w-screen h-screen bg-cover bg-center"
    >
      <div className="flex flex-col gap-6 items-center text-white shadow-2xl">
        <h1 className="text-6xl font-semibold">길을 잃었습니다.</h1>
        <p className="text-lg">
          잘못된 주소로 접근하셨습니다. 홈페이지로 이동해 다양한 컨텐츠를
          만나보세요.
        </p>
        <Button className="py-3" onClick={() => navigate("/")}>
          Cinema Hub 홈
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
