import Button from "../components/Button";
import MovieCard from "../components/mainpage/MovieCard";
import movie1 from "/images/movie1.png";
import movie2 from "/images/movie2.png";

const dummyMovies = [
  {
    id: "1",
    name: "중증외상센터",
    image: movie2,
    rating: 8.8,
    genre: "드라마",
    ageLimit: "15+",
  },
  {
    id: "2",
    name: "백두산",
    image: movie1,
    rating: 8.8,
    genre: "SF, 액션",
    ageLimit: "12세 이상",
  },

  {
    id: "3",
    name: "부산행",
    image: movie1,
    rating: 8.8,
    genre: "SF, 액션",
    ageLimit: "12+",
  },
];

const MyPage = () => {
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-[1280px] flex gap-2 mt-10">
          <div className="w-full border border-[#DFDFDF] rounded-2xl">
            프로필 박스
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-col justify-center items-center border border-[#DFDFDF] rounded-2xl p-4">
              <p className="">팔로워</p>
              <p>110명</p>
              <Button className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400">
                팔로워 보기
              </Button>
            </div>
            <div className="border border-[#DFDFDF] rounded-2xl p-4">
              <p>팔로잉</p>
              <p>200명</p>
              <button>팔로워 보기</button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-6 p-4">
        {dummyMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            image={movie.image}
            name={movie.name}
            rating={movie.rating}
            genre={movie.genre}
            ageLimit={movie.ageLimit}
          />
        ))}
      </div> */}
    </>
  );
};

export default MyPage;
