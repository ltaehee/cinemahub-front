interface MovieProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: {
    name: string[];
  };
}
const MovieCard: React.FC<MovieProps> = ({ image, name }) => {
  const handleCardClick = () => {};

  return (
    <div onClick={handleCardClick}>
      <div>
        <img src={image} alt="영화 이미지" />
        테스트용으로 추가
      </div>
      <div>
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
