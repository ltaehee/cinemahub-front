interface MovieProps {
  _id?: string;
  name?: string;
  image?: string;
}
const MovieCard: React.FC<MovieProps> = () => {
  const handleCardClick = () => {};

  return (
    <div onClick={handleCardClick}>
      <div>
        <img alt="영화 이미지" />
        MovieCard
      </div>
      <div>
        <h3>gdgd</h3>
      </div>
    </div>
  );
};

export default MovieCard;
