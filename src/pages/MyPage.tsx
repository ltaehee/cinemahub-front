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
      <div className="grid grid-cols-1 gap-6 p-4">
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
      </div>
    </>
  );
};

export default MyPage;
